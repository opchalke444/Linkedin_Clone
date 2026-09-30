import prisma from '../db/prisma.js';
import { ReactionType, NotificationType, ConnectionStatus } from '@prisma/client';
import { rankFeedPosts } from './feed-ranking.service.js';
import { emitToUser } from '../socket/socket.handler.js';

export class PostService {
  static async getFeed(currentUserId?: string, page = 1, limit = 10, filterAuthorId?: string) {
    const skip = (page - 1) * limit;

    // Fetch posts
    const whereClause: any = {};
    if (filterAuthorId) {
      whereClause.authorId = filterAuthorId;
    }

    const [rawPosts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where: whereClause,
        include: {
          author: {
            select: {
              id: true,
              fullName: true,
              headline: true,
              avatarUrl: true,
              location: true,
            },
          },
          reactions: currentUserId
            ? {
                where: { userId: currentUserId },
                select: { type: true, userId: true },
              }
            : false,
          _count: {
            select: {
              reactions: true,
              comments: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit * 2, // Fetch double for rank sorting
        skip,
      }),
      prisma.post.count({ where: whereClause }),
    ]);

    // Format reaction state for current user
    const postsWithUserState = rawPosts.map((p) => {
      const userReaction =
        Array.isArray(p.reactions) && p.reactions.length > 0
          ? p.reactions[0].type
          : null;

      return {
        ...p,
        userReaction,
        reactions: undefined, // Don't leak raw array
      };
    });

    // If viewer is logged in and not filtering by a single author, apply feed-ranking algorithm
    if (currentUserId && !filterAuthorId) {
      const [connections, userSkills] = await Promise.all([
        prisma.connection.findMany({
          where: {
            status: ConnectionStatus.ACCEPTED,
            OR: [{ senderId: currentUserId }, { receiverId: currentUserId }],
          },
        }),
        prisma.userSkill.findMany({
          where: { userId: currentUserId },
          include: { skill: true },
        }),
      ]);

      const connectionIds = new Set<string>(
        connections.map((c) => (c.senderId === currentUserId ? c.receiverId : c.senderId))
      );
      const userSkillNames = new Set<string>(userSkills.map((s) => s.skill.name));

      const ranked = rankFeedPosts(postsWithUserState, currentUserId, connectionIds, userSkillNames);
      return {
        posts: ranked.slice(0, limit),
        totalCount,
        page,
        hasMore: skip + limit < totalCount,
      };
    }

    return {
      posts: postsWithUserState.slice(0, limit),
      totalCount,
      page,
      hasMore: skip + limit < totalCount,
    };
  }

  static async getPostById(postId: string, currentUserId?: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            headline: true,
            avatarUrl: true,
          },
        },
        reactions: currentUserId
          ? {
              where: { userId: currentUserId },
              select: { type: true },
            }
          : false,
        _count: {
          select: { reactions: true, comments: true },
        },
      },
    });

    if (!post) throw new Error('Post not found.');

    const userReaction =
      Array.isArray(post.reactions) && post.reactions.length > 0
        ? post.reactions[0].type
        : null;

    return {
      ...post,
      userReaction,
      reactions: undefined,
    };
  }

  static async createPost(authorId: string, data: { content: string; imageUrl?: string | null; linkUrl?: string | null; tags?: string | null }) {
    return prisma.post.create({
      data: {
        authorId,
        content: data.content,
        imageUrl: data.imageUrl || null,
        linkUrl: data.linkUrl || null,
        tags: data.tags || null,
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            headline: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  static async updatePost(postId: string, userId: string, data: { content: string; imageUrl?: string | null; linkUrl?: string | null; tags?: string | null }) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new Error('Post not found.');
    if (post.authorId !== userId) throw new Error('Unauthorized to edit this post.');

    return prisma.post.update({
      where: { id: postId },
      data,
      include: {
        author: {
          select: { id: true, fullName: true, headline: true, avatarUrl: true },
        },
      },
    });
  }

  static async deletePost(postId: string, userId: string) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new Error('Post not found.');
    if (post.authorId !== userId) throw new Error('Unauthorized to delete this post.');

    return prisma.post.delete({ where: { id: postId } });
  }

  // Scalable Reactions: LIKE, CELEBRATE, SUPPORT, LOVE, INSIGHTFUL
  static async toggleReaction(postId: string, userId: string, type: ReactionType) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new Error('Post not found.');

    const existing = await prisma.reaction.findUnique({
      where: {
        postId_userId: { postId, userId },
      },
    });

    let currentReaction: ReactionType | null = null;

    if (existing) {
      if (existing.type === type) {
        // Toggle OFF (remove reaction)
        await prisma.reaction.delete({ where: { id: existing.id } });
        await prisma.post.update({
          where: { id: postId },
          data: { likeCount: { decrement: 1 } },
        });
        currentReaction = null;
      } else {
        // Change reaction type
        await prisma.reaction.update({
          where: { id: existing.id },
          data: { type },
        });
        currentReaction = type;
      }
    } else {
      // Create new reaction
      await prisma.reaction.create({
        data: { postId, userId, type },
      });
      await prisma.post.update({
        where: { id: postId },
        data: { likeCount: { increment: 1 } },
      });
      currentReaction = type;

      // Notify post author if not self
      if (post.authorId !== userId) {
        const notification = await prisma.notification.create({
          data: {
            recipientId: post.authorId,
            actorId: userId,
            type: NotificationType.POST_REACTION,
            referenceId: postId,
          },
          include: {
            actor: {
              select: { id: true, fullName: true, avatarUrl: true, headline: true },
            },
          },
        });
        emitToUser(post.authorId, 'notification:new', notification);
      }
    }

    const updatedPost = await prisma.post.findUnique({
      where: { id: postId },
      select: { likeCount: true },
    });

    return {
      userReaction: currentReaction,
      likeCount: updatedPost?.likeCount || 0,
    };
  }

  // Comments & Replies
  static async getComments(postId: string) {
    const comments = await prisma.comment.findMany({
      where: { postId, parentId: null },
      include: {
        author: {
          select: { id: true, fullName: true, headline: true, avatarUrl: true },
        },
        replies: {
          include: {
            author: {
              select: { id: true, fullName: true, headline: true, avatarUrl: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return comments;
  }

  static async addComment(postId: string, authorId: string, content: string, parentId?: string | null) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new Error('Post not found.');

    const comment = await prisma.comment.create({
      data: {
        postId,
        authorId,
        content,
        parentId: parentId || null,
      },
      include: {
        author: {
          select: { id: true, fullName: true, headline: true, avatarUrl: true },
        },
      },
    });

    await prisma.post.update({
      where: { id: postId },
      data: { commentCount: { increment: 1 } },
    });

    // Send notification
    if (parentId) {
      // Comment reply notification to parent comment author
      const parentComment = await prisma.comment.findUnique({ where: { id: parentId } });
      if (parentComment && parentComment.authorId !== authorId) {
        const notif = await prisma.notification.create({
          data: {
            recipientId: parentComment.authorId,
            actorId: authorId,
            type: NotificationType.COMMENT_REPLY,
            referenceId: postId,
          },
          include: {
            actor: { select: { id: true, fullName: true, avatarUrl: true } },
          },
        });
        emitToUser(parentComment.authorId, 'notification:new', notif);
      }
    } else if (post.authorId !== authorId) {
      // Post comment notification to post author
      const notif = await prisma.notification.create({
        data: {
          recipientId: post.authorId,
          actorId: authorId,
          type: NotificationType.POST_COMMENT,
          referenceId: postId,
        },
        include: {
          actor: { select: { id: true, fullName: true, avatarUrl: true } },
        },
      });
      emitToUser(post.authorId, 'notification:new', notif);
    }

    return comment;
  }

  static async deleteComment(commentId: string, userId: string) {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { post: true },
    });

    if (!comment) throw new Error('Comment not found.');
    if (comment.authorId !== userId && comment.post.authorId !== userId) {
      throw new Error('Unauthorized to delete this comment.');
    }

    await prisma.comment.delete({ where: { id: commentId } });
    await prisma.post.update({
      where: { id: comment.postId },
      data: { commentCount: { decrement: 1 } },
    });

    return { deleted: true };
  }

  static async sharePost(postId: string) {
    return prisma.post.update({
      where: { id: postId },
      data: { shareCount: { increment: 1 } },
    });
  }
}
