import { Router } from 'express';
import { MessageController } from '../controllers/message.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/conversations', MessageController.getConversations);
router.get('/conversations/:conversationId', MessageController.getMessages);
router.post('/', MessageController.sendMessage);

export default router;
