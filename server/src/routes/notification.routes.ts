import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', NotificationController.getNotifications);
router.put('/read-all', NotificationController.markAllAsRead);
router.put('/:id/read', NotificationController.markAsRead);

export default router;
