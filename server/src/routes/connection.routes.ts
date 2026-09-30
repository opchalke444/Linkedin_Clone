import { Router } from 'express';
import { ConnectionController } from '../controllers/connection.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/my', ConnectionController.getMyConnections);
router.get('/pending', ConnectionController.getPendingRequests);
router.post('/request/:userId?', ConnectionController.sendRequest);
router.put('/:id/accept', ConnectionController.acceptRequest);
router.put('/:id/reject', ConnectionController.rejectRequest);
router.delete('/:id/cancel', ConnectionController.cancelRequest);
router.delete('/:id', ConnectionController.removeConnection);

export default router;
