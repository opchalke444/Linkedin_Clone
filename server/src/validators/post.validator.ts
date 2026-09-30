import { z } from 'zod';
import { ReactionType } from '@prisma/client';

export const createPostSchema = z.object({
  body: z.object({
    content: z
      .string({ required_error: 'Post content cannot be empty' })
      .trim()
      .min(1, 'Post content cannot be empty')
      .max(3000, 'Post content cannot exceed 3000 characters'),
    imageUrl: z.string().optional().nullable(),
    linkUrl: z.string().url().optional().nullable().or(z.literal('')),
    tags: z.string().optional().nullable(),
  }),
});

export const updatePostSchema = z.object({
  body: z.object({
    content: z
      .string({ required_error: 'Post content cannot be empty' })
      .trim()
      .min(1, 'Post content cannot be empty')
      .max(3000, 'Post content cannot exceed 3000 characters'),
    imageUrl: z.string().optional().nullable(),
    linkUrl: z.string().url().optional().nullable().or(z.literal('')),
    tags: z.string().optional().nullable(),
  }),
});

export const createCommentSchema = z.object({
  body: z.object({
    content: z
      .string({ required_error: 'Comment cannot be empty' })
      .trim()
      .min(1, 'Comment cannot be empty')
      .max(1000, 'Comment cannot exceed 1000 characters'),
    parentId: z.string().uuid().optional().nullable(),
  }),
});

export const reactionSchema = z.object({
  body: z.object({
    type: z.nativeEnum(ReactionType, {
      errorMap: () => ({ message: 'Invalid reaction type. Must be LIKE, CELEBRATE, SUPPORT, LOVE, or INSIGHTFUL.' }),
    }),
  }),
});
