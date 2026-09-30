import path from 'path';
import fs from 'fs';
import net from 'net';
import pg from 'pg';

let dbInstance: any = null;

// Check if a TCP port is in use
export function isPortOpen(port: number, host = '127.0.0.1'): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(1000);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('error', () => {
      socket.destroy();
      resolve(false);
    });
    socket.connect(port, host);
  });
}

export async function ensurePostgresRunning(): Promise<void> {
  const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/linkedin_db?schema=public';
  
  // Extract port and database name from URL if present
  const portMatch = dbUrl.match(/:(\d+)\//);
  const port = portMatch ? parseInt(portMatch[1], 10) : 5433;
  const dbNameMatch = dbUrl.match(/:(\d+)\/([^?]+)/);
  const dbName = dbNameMatch ? dbNameMatch[2] : 'linkedin_db';
  const isCloudDb = dbUrl.includes('neon.tech') || dbUrl.includes('supabase.co') || !dbUrl.includes('localhost');

  if (isCloudDb) {
    console.log('[PostgreSQL] Connecting to remote Cloud PostgreSQL instance...');
    return;
  }

  const portActive = await isPortOpen(port);
  if (portActive) {
    console.log(`[PostgreSQL] PostgreSQL is already active on port ${port}.`);
    return;
  }

  console.log(`[PostgreSQL] Starting embedded PostgreSQL 18 server on port ${port}...`);
  const { default: EmbeddedPostgres } = await import('embedded-postgres');
  
  const dataDir = path.resolve(process.cwd(), 'pgdata');
  const needsInit = !fs.existsSync(dataDir) || fs.readdirSync(dataDir).length === 0;

  dbInstance = new EmbeddedPostgres({
    port,
    databaseDir: dataDir,
    user: 'postgres',
    password: 'postgres',
    persistent: true,
  });

  if (needsInit) {
    console.log('[PostgreSQL] Initializing new database cluster...');
    await dbInstance.initialise();
  }

  await dbInstance.start();
  console.log(`[PostgreSQL] Embedded PostgreSQL running on port ${port}.`);

  // Ensure target database exists with UTF-8 encoding
  const client = new pg.Client({
    host: '127.0.0.1',
    port,
    user: 'postgres',
    password: 'postgres',
    database: 'postgres',
  });

  try {
    await client.connect();
    const res = await client.query("SELECT pg_encoding_to_char(encoding) as enc FROM pg_database WHERE datname = $1", [dbName]);
    if (res.rowCount === 0) {
      console.log(`[PostgreSQL] Creating '${dbName}' database with UTF8 encoding...`);
      await client.query(`CREATE DATABASE "${dbName}" WITH ENCODING 'UTF8' TEMPLATE template0 LC_COLLATE 'C' LC_CTYPE 'C'`);
    } else if (res.rows[0]?.enc !== 'UTF8') {
      console.log(`[PostgreSQL] Current encoding is ${res.rows[0]?.enc}. Recreating '${dbName}' with UTF8 encoding...`);
      await client.query(`DROP DATABASE "${dbName}"`);
      await client.query(`CREATE DATABASE "${dbName}" WITH ENCODING 'UTF8' TEMPLATE template0 LC_COLLATE 'C' LC_CTYPE 'C'`);
    }
  } catch (err) {
    console.error('[PostgreSQL] Database existence check error:', err);
  } finally {
    await client.end().catch(() => {});
  }

  // Graceful shutdown
  const shutdown = async () => {
    if (dbInstance) {
      console.log('\n[PostgreSQL] Gracefully stopping embedded PostgreSQL...');
      try {
        await dbInstance.stop();
      } catch (_) {}
      process.exit(0);
    }
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

// Standalone runner
if (process.argv[1]?.includes('embedded-pg')) {
  ensurePostgresRunning().then(() => {
    console.log('[PostgreSQL] Ready for connections. Keep this process running or run with the server.');
  }).catch((err) => {
    console.error('[PostgreSQL] Error starting embedded Postgres:', err);
    process.exit(1);
  });
}
