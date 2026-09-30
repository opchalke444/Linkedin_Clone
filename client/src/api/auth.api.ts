import api from './client';
import { User } from '../types';

export const authApi = {
  register: (data: any): Promise<{ success: boolean; data: { user: User; token: string } }> =>
    api.post('/auth/register', data),

  login: (data: any): Promise<{ success: boolean; data: { user: User; token: string } }> =>
    api.post('/auth/login', data),

  logout: (): Promise<{ success: boolean }> => api.post('/auth/logout'),

  getMe: (): Promise<{ success: boolean; data: User }> => api.get('/auth/me'),
};
