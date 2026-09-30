import { execSync } from 'child_process';
import { ensurePostgresRunning } from './embedded-pg.js';

async function setup() {
  console.log('====================================================');
  console.log('LinkedIn Database Setup & Migration Runner');
  console.log('====================================================\n');

  try {
    // 1. Ensure PostgreSQL is active
    console.log('[Step 1/3] Ensuring PostgreSQL database is active...');
    await ensurePostgresRunning();
    console.log('✓ PostgreSQL is running and ready.\n');

    // 2. Push schema to database
    console.log('[Step 2/3] Synchronizing schema with PostgreSQL database (prisma db push)...');
    execSync('npx prisma db push', {
      stdio: 'inherit',
      cwd: process.cwd(),
      env: process.env,
    });
    console.log('✓ Database schema synchronized successfully.\n');

    // 3. Seed realistic development data
    console.log('[Step 3/3] Populating realistic development seed data...');
    execSync('npx tsx prisma/seed.ts', {
      stdio: 'inherit',
      cwd: process.cwd(),
      env: process.env,
    });
    console.log('✓ Seed data populated successfully.\n');

    console.log('====================================================');
    console.log('LinkedIn Database Setup Completed Successfully!');
    console.log('====================================================');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database setup encountered an error:', error);
    process.exit(1);
  }
}

setup();
