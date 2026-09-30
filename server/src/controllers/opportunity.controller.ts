import { Response, NextFunction } from 'express';
import { OpportunityService } from '../services/opportunity.service.js';
import { sendSuccess } from '../utils/api-response.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export class OpportunityController {
  static async getOpportunities(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const opportunities = await OpportunityService.getOpportunities(req.user?.id);
      return sendSuccess(res, opportunities);
    } catch (error) {
      return next(error);
    }
  }

  static async applyToOpportunity(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const application = await OpportunityService.applyToOpportunity(req.params.id, req.user!.id);
      return sendSuccess(res, application, 'Application submitted successfully', 201);
    } catch (error) {
      return next(error);
    }
  }
}
