import { Response, NextFunction } from 'express';
import { NotificationService } from '../services/notification.service.js';
import { sendSuccess } from '../utils/api-response.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export class NotificationController {
  static async getNotifications(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await NotificationService.getNotifications(req.user!.id);
      return sendSuccess(res, data);
    } catch (error) {
      return next(error);
    }
  }

  static async markAsRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const updated = await NotificationService.markAsRead(req.params.id, req.user!.id);
      return sendSuccess(res, updated);
    } catch (error) {
      return next(error);
    }
  }

  static async markAllAsRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await NotificationService.markAllAsRead(req.user!.id);
      return sendSuccess(res, null, 'All notifications marked as read');
    } catch (error) {
      return next(error);
    }
  }
}
