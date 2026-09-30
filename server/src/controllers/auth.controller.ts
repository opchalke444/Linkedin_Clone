import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { sendSuccess } from '../utils/api-response.js';
import { authCookieOptions, AUTH_COOKIE_NAME } from '../utils/jwt.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, token } = await AuthService.register(req.body);
      res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions);
      return sendSuccess(res, { user, token }, 'Registration successful', 201);
    } catch (error) {
      return next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, token } = await AuthService.login(req.body);
      res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions);
      return sendSuccess(res, { user, token }, 'Login successful');
    } catch (error) {
      return next(error);
    }
  }

  static async logout(_req: Request, res: Response) {
    res.clearCookie(AUTH_COOKIE_NAME, {
      ...authCookieOptions,
      maxAge: 0,
    });
    return sendSuccess(res, null, 'Logged out successfully');
  }

  static async getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.getMe(req.user!.id);
      return sendSuccess(res, user);
    } catch (error) {
      return next(error);
    }
  }
}
