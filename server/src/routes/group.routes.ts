import { Router } from 'express';
import { GroupController } from '../controllers/group.controller.js';
import { requireAuth, optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', optionalAuth, GroupController.getAllGroups);
router.get('/:slug', optionalAuth, GroupController.getGroupBySlug);
router.post('/', requireAuth, GroupController.createGroup);
router.post('/:id/join', requireAuth, GroupController.joinGroup);
router.post('/:id/leave', requireAuth, GroupController.leaveGroup);
router.post('/:id/posts', requireAuth, GroupController.createGroupPost);

export default router;
