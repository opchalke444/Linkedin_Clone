import api from './client';

export const searchApi = {
  search: (params: {
    q?: string;
    type?: 'all' | 'users' | 'posts' | 'groups' | 'skills';
    location?: string;
    industry?: string;
    skill?: string;
    limit?: number;
  }): Promise<{ success: boolean; data: { users: any[]; posts: any[]; groups: any[]; skills: any[] } }> =>
    api.get('/search', { params }),
};
