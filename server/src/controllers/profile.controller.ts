import { Response, NextFunction } from 'express';
import { ProfileService } from '../services/profile.service.js';
import { sendSuccess } from '../utils/api-response.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export class ProfileController {
  // Education
  static async addEducation(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const education = await ProfileService.addEducation(req.user!.id, req.body);
      return sendSuccess(res, education, 'Education added successfully', 201);
    } catch (error) {
      return next(error);
    }
  }

  static async updateEducation(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const education = await ProfileService.updateEducation(req.params.id, req.user!.id, req.body);
      return sendSuccess(res, education, 'Education updated successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async deleteEducation(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await ProfileService.deleteEducation(req.params.id, req.user!.id);
      return sendSuccess(res, null, 'Education deleted successfully');
    } catch (error) {
      return next(error);
    }
  }

  // Experience
  static async addExperience(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const experience = await ProfileService.addExperience(req.user!.id, req.body);
      return sendSuccess(res, experience, 'Experience added successfully', 201);
    } catch (error) {
      return next(error);
    }
  }

  static async updateExperience(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const experience = await ProfileService.updateExperience(req.params.id, req.user!.id, req.body);
      return sendSuccess(res, experience, 'Experience updated successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async deleteExperience(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await ProfileService.deleteExperience(req.params.id, req.user!.id);
      return sendSuccess(res, null, 'Experience deleted successfully');
    } catch (error) {
      return next(error);
    }
  }

  // Skills
  static async addSkill(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const skill = await ProfileService.addSkill(req.user!.id, req.body.name, req.body.proficiency);
      return sendSuccess(res, skill, 'Skill added successfully', 201);
    } catch (error) {
      return next(error);
    }
  }

  static async removeSkill(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await ProfileService.removeSkill(req.params.id, req.user!.id);
      return sendSuccess(res, null, 'Skill removed successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async endorseSkill(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const skill = await ProfileService.endorseSkill(req.params.id, req.user!.id);
      return sendSuccess(res, skill, 'Skill endorsed successfully');
    } catch (error) {
      return next(error);
    }
  }
}
