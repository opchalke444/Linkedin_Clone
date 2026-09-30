import { Response, NextFunction } from 'express';
import { ConnectionService } from '../services/connection.service.js';
import { sendSuccess } from '../utils/api-response.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export class ConnectionController {
  static async sendRequest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const targetUserId = req.body.receiverId || req.params.userId;
      const connection = await ConnectionService.sendRequest(req.user!.id, targetUserId);
      return sendSuccess(res, connection, 'Connection request sent successfully', 201);
    } catch (error) {
      return next(error);
    }
  }

  static async acceptRequest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const connection = await ConnectionService.acceptRequest(req.params.id, req.user!.id);
      return sendSuccess(res, connection, 'Connection request accepted');
    } catch (error) {
      return next(error);
    }
  }

  static async rejectRequest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await ConnectionService.rejectRequest(req.params.id, req.user!.id);
      return sendSuccess(res, null, 'Connection request rejected');
    } catch (error) {
      return next(error);
    }
  }

  static async cancelRequest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await ConnectionService.cancelRequest(req.params.id, req.user!.id);
      return sendSuccess(res, null, 'Connection request cancelled');
    } catch (error) {
      return next(error);
    }
  }

  static async removeConnection(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await ConnectionService.removeConnection(req.params.id, req.user!.id);
      return sendSuccess(res, null, 'Connection removed');
    } catch (error) {
      return next(error);
    }
  }

  static async getMyConnections(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const connections = await ConnectionService.getMyConnections(req.user!.id);
      return sendSuccess(res, connections);
    } catch (error) {
      return next(error);
    }
  }

  static async getPendingRequests(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const pending = await ConnectionService.getPendingRequests(req.user!.id);
      return sendSuccess(res, pending);
    } catch (error) {
      return next(error);
    }
  }
}
