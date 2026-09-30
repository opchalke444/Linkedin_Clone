import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { ensurePostgresRunning } from './db/embedded-pg.js';
import { initializeSocket } from './socket/socket.handler.js';

const PORT = parseInt(process.env.PORT || '5000', 10);

async function startServer() {
  try {
    // 1. Ensure PostgreSQL is active
    await ensurePostgresRunning();

    // 2. Create HTTP & Socket.IO server
    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: ['http://localhost:5173', 'http://127.0.0.1:5173', process.env.CLIENT_URL || 'http://localhost:5173'],
        credentials: true,
      },
    });

    // 3. Initialize real-time events
    initializeSocket(io);

    // 4. Start listening
    server.listen(PORT, () => {
      console.log('\n====================================================');
      console.log('⚡ LinkedIn Clone Backend API Server is Running!');
      console.log(`📡 URL: http://localhost:${PORT}`);
      console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
      console.log(`🔌 Socket.IO: Ready for real-time messaging`);
      console.log('====================================================\n');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
