import { Response, NextFunction } from 'express';
import { SearchService } from '../services/search.service.js';
import { sendSuccess } from '../utils/api-response.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export class SearchController {
  static async search(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { q, type, location, industry, skill, limit } = req.query;

      const results = await SearchService.search({
        q: q as string,
        type: type as any,
        location: location as string,
        industry: industry as string,
        skill: skill as string,
        limit: limit ? parseInt(limit as string, 10) : 15,
        currentUserId: req.user?.id,
      });

      return sendSuccess(res, results);
    } catch (error) {
      return next(error);
    }
  }
}
