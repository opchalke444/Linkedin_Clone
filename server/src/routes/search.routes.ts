import { Router } from 'express';
import { SearchController } from '../controllers/search.controller.js';
import { optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', optionalAuth, SearchController.search);

export default router;
