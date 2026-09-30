import { Response, NextFunction } from 'express';
import { UserService } from '../services/user.service.js';
import { sendSuccess } from '../utils/api-response.js';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { uploadMedia } from '../utils/cloudinary.js';

export class UserController {
  static async getUserById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getUserById(req.params.id, req.user?.id);
      return sendSuccess(res, user);
    } catch (error) {
      return next(error);
    }
  }

  static async getRecommendations(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const recommendations = await UserService.getSkillBasedRecommendations(req.user!.id);
      return sendSuccess(res, recommendations);
    } catch (error) {
      return next(error);
    }
  }

  static async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const updated = await UserService.updateProfile(req.user!.id, req.body);
      return sendSuccess(res, updated, 'Profile updated successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async uploadAvatar(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.file) throw new Error('No image file provided.');
      const avatarUrl = await uploadMedia(req.file, 'linkedin/avatars');
      const updated = await UserService.updateProfile(req.user!.id, { avatarUrl });
      return sendSuccess(res, { avatarUrl, user: updated }, 'Avatar uploaded successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async uploadBanner(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.file) throw new Error('No image file provided.');
      const bannerUrl = await uploadMedia(req.file, 'linkedin/banners');
      const updated = await UserService.updateProfile(req.user!.id, { bannerUrl });
      return sendSuccess(res, { bannerUrl, user: updated }, 'Banner uploaded successfully');
    } catch (error) {
      return next(error);
    }
  }
}
