import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { addEducationSchema, addExperienceSchema, addSkillSchema } from '../validators/profile.validator.js';

const router = Router();

router.use(requireAuth);

// Education
router.post('/education', validate(addEducationSchema), ProfileController.addEducation);
router.put('/education/:id', ProfileController.updateEducation);
router.delete('/education/:id', ProfileController.deleteEducation);

// Experience
router.post('/experience', validate(addExperienceSchema), ProfileController.addExperience);
router.put('/experience/:id', ProfileController.updateExperience);
router.delete('/experience/:id', ProfileController.deleteExperience);

// Skills
router.post('/skills', validate(addSkillSchema), ProfileController.addSkill);
router.delete('/skills/:id', ProfileController.removeSkill);
router.post('/skills/:id/endorse', ProfileController.endorseSkill);

export default router;
