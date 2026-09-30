import api from './client';
import { Post, Comment, ReactionType } from '../types';

export const postApi = {
  getFeed: (page = 1, limit = 10, authorId?: string): Promise<{ success: boolean; data: Post[]; meta: { totalCount: number; page: number; hasMore: boolean } }> =>
    api.get('/posts', { params: { page, limit, authorId } }),

  getPostById: (id: string): Promise<{ success: boolean; data: Post }> =>
    api.get(`/posts/${id}`),

  createPost: (data: FormData | { content: string; imageUrl?: string; linkUrl?: string; tags?: string }): Promise<{ success: boolean; data: Post }> => {
    if (data instanceof FormData) {
      return api.post('/posts', data, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return api.post('/posts', data);
  },

  updatePost: (id: string, data: any): Promise<{ success: boolean; data: Post }> =>
    api.put(`/posts/${id}`, data),

  deletePost: (id: string): Promise<{ success: boolean }> =>
    api.delete(`/posts/${id}`),

  toggleReaction: (id: string, type: ReactionType): Promise<{ success: boolean; data: { userReaction: ReactionType | null; likeCount: number } }> =>
    api.post(`/posts/${id}/reactions`, { type }),

  getComments: (id: string): Promise<{ success: boolean; data: Comment[] }> =>
    api.get(`/posts/${id}/comments`),

  addComment: (id: string, content: string, parentId?: string | null): Promise<{ success: boolean; data: Comment }> =>
    api.post(`/posts/${id}/comments`, { content, parentId }),

  deleteComment: (postId: string, commentId: string): Promise<{ success: boolean }> =>
    api.delete(`/posts/${postId}/comments/${commentId}`),

  sharePost: (id: string): Promise<{ success: boolean; data: { shareCount: number } }> =>
    api.post(`/posts/${id}/share`),
};
