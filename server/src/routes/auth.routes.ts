import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/me', requireAuth, AuthController.getMe);

export default router;
