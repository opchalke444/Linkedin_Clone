import { Router } from 'express';
import { OpportunityController } from '../controllers/opportunity.controller.js';
import { optionalAuth, requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', optionalAuth, OpportunityController.getOpportunities);
router.post('/:id/apply', requireAuth, OpportunityController.applyToOpportunity);

export default router;
