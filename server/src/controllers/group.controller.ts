import { Response, NextFunction } from 'express';
import { GroupService } from '../services/group.service.js';
import { sendSuccess } from '../utils/api-response.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export class GroupController {
  static async getAllGroups(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const groups = await GroupService.getAllGroups(req.user?.id);
      return sendSuccess(res, groups);
    } catch (error) {
      return next(error);
    }
  }

  static async getGroupBySlug(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const group = await GroupService.getGroupBySlug(req.params.slug, req.user?.id);
      return sendSuccess(res, group);
    } catch (error) {
      return next(error);
    }
  }

  static async createGroup(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const group = await GroupService.createGroup(req.user!.id, req.body);
      return sendSuccess(res, group, 'Group created successfully', 201);
    } catch (error) {
      return next(error);
    }
  }

  static async joinGroup(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const member = await GroupService.joinGroup(req.params.id, req.user!.id);
      return sendSuccess(res, member, 'Joined group');
    } catch (error) {
      return next(error);
    }
  }

  static async leaveGroup(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await GroupService.leaveGroup(req.params.id, req.user!.id);
      return sendSuccess(res, null, 'Left group');
    } catch (error) {
      return next(error);
    }
  }

  static async createGroupPost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const post = await GroupService.createGroupPost(
        req.params.id,
        req.user!.id,
        req.body.content,
        req.body.imageUrl
      );
      return sendSuccess(res, post, 'Group post created', 201);
    } catch (error) {
      return next(error);
    }
  }
}
