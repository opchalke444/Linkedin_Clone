import { Router } from 'express';
import { PostController } from '../controllers/post.controller.js';
import { requireAuth, optionalAuth } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createPostSchema, updatePostSchema, createCommentSchema, reactionSchema } from '../validators/post.validator.js';

const router = Router();

// Feed & Posts
router.get('/', optionalAuth, PostController.getFeed);
router.get('/feed', optionalAuth, PostController.getFeed);
router.get('/:id', optionalAuth, PostController.getPostById);
router.post('/', requireAuth, upload.single('image'), validate(createPostSchema), PostController.createPost);
router.put('/:id', requireAuth, validate(updatePostSchema), PostController.updatePost);
router.delete('/:id', requireAuth, PostController.deletePost);
router.post('/:id/share', requireAuth, PostController.sharePost);

// Reactions
router.post('/:id/reactions', requireAuth, validate(reactionSchema), PostController.toggleReaction);

// Comments
router.get('/:id/comments', optionalAuth, PostController.getComments);
router.post('/:id/comments', requireAuth, validate(createCommentSchema), PostController.addComment);
router.delete('/:id/comments/:commentId', requireAuth, PostController.deleteComment);

export default router;
