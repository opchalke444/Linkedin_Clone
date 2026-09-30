import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { requireAuth, optionalAuth } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { updateProfileSchema } from '../validators/profile.validator.js';

const router = Router();

router.get('/recommendations', requireAuth, UserController.getRecommendations);
router.get('/:id', optionalAuth, UserController.getUserById);
router.put('/profile', requireAuth, validate(updateProfileSchema), UserController.updateProfile);
router.post('/avatar', requireAuth, upload.single('avatar'), UserController.uploadAvatar);
router.post('/banner', requireAuth, upload.single('banner'), UserController.uploadBanner);

export default router;
