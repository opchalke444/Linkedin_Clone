import { Request, Response, NextFunction } from 'express';
import { verifyToken, AUTH_COOKIE_NAME } from '../utils/jwt.js';
import { sendError } from '../utils/api-response.js';
import prisma from '../db/prisma.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    let token: string | undefined;

    // 1. Check HTTP-only cookie
    if (req.cookies && req.cookies[AUTH_COOKIE_NAME]) {
      token = req.cookies[AUTH_COOKIE_NAME];
    }
    // 2. Check Authorization header
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendError(res, 'Authentication required. Please log in.', 401);
    }

    const payload = verifyToken(token);

    // Verify user still exists in database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      return sendError(res, 'User session invalid. Please log in again.', 401);
    }

    req.user = user;
    return next();
  } catch (err: any) {
    return sendError(res, 'Invalid or expired authentication token.', 401);
  }
}

export async function optionalAuth(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<any> {
  try {
    let token: string | undefined;
    if (req.cookies && req.cookies[AUTH_COOKIE_NAME]) {
      token = req.cookies[AUTH_COOKIE_NAME];
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const payload = verifyToken(token);
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, email: true, role: true },
      });
      if (user) {
        req.user = user;
      }
    }
  } catch (_) {
    // Ignore invalid tokens for optional auth
  }
  return next();
}
