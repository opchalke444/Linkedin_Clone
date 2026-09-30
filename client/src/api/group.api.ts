import api from './client';
import { GroupItem } from '../types';

export const groupApi = {
  getAllGroups: (): Promise<{ success: boolean; data: GroupItem[] }> =>
    api.get('/groups'),

  getGroupBySlug: (slug: string): Promise<{ success: boolean; data: GroupItem }> =>
    api.get(`/groups/${slug}`),

  createGroup: (data: { name: string; description: string; avatarUrl?: string }): Promise<{ success: boolean; data: GroupItem }> =>
    api.post('/groups', data),

  joinGroup: (id: string): Promise<{ success: boolean }> =>
    api.post(`/groups/${id}/join`),

  leaveGroup: (id: string): Promise<{ success: boolean }> =>
    api.post(`/groups/${id}/leave`),

  createGroupPost: (id: string, content: string, imageUrl?: string): Promise<{ success: boolean; data: any }> =>
    api.post(`/groups/${id}/posts`, { content, imageUrl }),
};
