import { Response, NextFunction } from 'express';
import { PostService } from '../services/post.service.js';
import { sendSuccess } from '../utils/api-response.js';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { uploadMedia } from '../utils/cloudinary.js';

export class PostController {
  static async getFeed(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const authorId = req.query.authorId as string | undefined;

      const feed = await PostService.getFeed(req.user?.id, page, limit, authorId);
      return sendSuccess(res, feed.posts, undefined, 200, {
        totalCount: feed.totalCount,
        page: feed.page,
        hasMore: feed.hasMore,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getPostById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const post = await PostService.getPostById(req.params.id, req.user?.id);
      return sendSuccess(res, post);
    } catch (error) {
      return next(error);
    }
  }

  static async createPost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      let imageUrl = req.body.imageUrl;
      if (req.file) {
        imageUrl = await uploadMedia(req.file, 'linkedin/posts');
      }

      const post = await PostService.createPost(req.user!.id, {
        content: req.body.content,
        imageUrl,
        linkUrl: req.body.linkUrl,
        tags: req.body.tags,
      });

      return sendSuccess(res, post, 'Post published successfully', 201);
    } catch (error) {
      return next(error);
    }
  }

  static async updatePost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const post = await PostService.updatePost(req.params.id, req.user!.id, req.body);
      return sendSuccess(res, post, 'Post updated successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async deletePost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await PostService.deletePost(req.params.id, req.user!.id);
      return sendSuccess(res, null, 'Post deleted successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async toggleReaction(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await PostService.toggleReaction(req.params.id, req.user!.id, req.body.type);
      return sendSuccess(res, result);
    } catch (error) {
      return next(error);
    }
  }

  static async getComments(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const comments = await PostService.getComments(req.params.id);
      return sendSuccess(res, comments);
    } catch (error) {
      return next(error);
    }
  }

  static async addComment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const comment = await PostService.addComment(
        req.params.id,
        req.user!.id,
        req.body.content,
        req.body.parentId
      );
      return sendSuccess(res, comment, 'Comment posted', 201);
    } catch (error) {
      return next(error);
    }
  }

  static async deleteComment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await PostService.deleteComment(req.params.commentId, req.user!.id);
      return sendSuccess(res, null, 'Comment deleted');
    } catch (error) {
      return next(error);
    }
  }

  static async sharePost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const updated = await PostService.sharePost(req.params.id);
      return sendSuccess(res, { shareCount: updated.shareCount });
    } catch (error) {
      return next(error);
    }
  }
}
