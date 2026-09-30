import { Response, NextFunction } from 'express';
import { MessageService } from '../services/message.service.js';
import { sendSuccess } from '../utils/api-response.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export class MessageController {
  static async getConversations(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const conversations = await MessageService.getConversations(req.user!.id);
      return sendSuccess(res, conversations);
    } catch (error) {
      return next(error);
    }
  }

  static async getMessages(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await MessageService.getMessages(req.params.conversationId, req.user!.id);
      return sendSuccess(res, data);
    } catch (error) {
      return next(error);
    }
  }

  static async sendMessage(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const message = await MessageService.sendMessage(
        req.user!.id,
        req.body.receiverId,
        req.body.content
      );
      return sendSuccess(res, message, 'Message sent', 201);
    } catch (error) {
      return next(error);
    }
  }
}
