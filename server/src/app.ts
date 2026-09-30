import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';

// Routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import profileRoutes from './routes/profile.routes.js';
import connectionRoutes from './routes/connection.routes.js';
import postRoutes from './routes/post.routes.js';
import messageRoutes from './routes/message.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import searchRoutes from './routes/search.routes.js';
import groupRoutes from './routes/group.routes.js';
import opportunityRoutes from './routes/opportunity.routes.js';
import docsRoutes from './routes/docs.routes.js';

// Middlewares
import { errorHandler } from './middleware/error.middleware.js';

export const app = express();

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration for credentials and Vite frontend
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL || 'http://localhost:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow dev origins dynamically
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Static file serving for uploads fallback
const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'LinkedIn Clone Professional Network API',
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api-docs', docsRoutes);

// Centralized error handler
app.use(errorHandler);

export default app;
