import api from './client';
import { User, Education, Experience, UserSkill } from '../types';

export const userApi = {
  getUserById: (id: string): Promise<{ success: boolean; data: User }> =>
    api.get(`/users/${id}`),

  getRecommendations: (): Promise<{ success: boolean; data: (User & { commonSkills: string[]; similarityScore: number })[] }> =>
    api.get('/users/recommendations'),

  updateProfile: (data: any): Promise<{ success: boolean; data: User }> =>
    api.put('/users/profile', data),

  uploadAvatar: (formData: FormData): Promise<{ success: boolean; data: { avatarUrl: string } }> =>
    api.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  uploadBanner: (formData: FormData): Promise<{ success: boolean; data: { bannerUrl: string } }> =>
    api.post('/users/banner', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Education
  addEducation: (data: any): Promise<{ success: boolean; data: Education }> =>
    api.post('/profile/education', data),
  updateEducation: (id: string, data: any): Promise<{ success: boolean; data: Education }> =>
    api.put(`/profile/education/${id}`, data),
  deleteEducation: (id: string): Promise<{ success: boolean }> =>
    api.delete(`/profile/education/${id}`),

  // Experience
  addExperience: (data: any): Promise<{ success: boolean; data: Experience }> =>
    api.post('/profile/experience', data),
  updateExperience: (id: string, data: any): Promise<{ success: boolean; data: Experience }> =>
    api.put(`/profile/experience/${id}`, data),
  deleteExperience: (id: string): Promise<{ success: boolean }> =>
    api.delete(`/profile/experience/${id}`),

  // Skills
  addSkill: (data: { name: string; proficiency?: string }): Promise<{ success: boolean; data: UserSkill }> =>
    api.post('/profile/skills', data),
  removeSkill: (id: string): Promise<{ success: boolean }> =>
    api.delete(`/profile/skills/${id}`),
  endorseSkill: (id: string): Promise<{ success: boolean; data: UserSkill }> =>
    api.post(`/profile/skills/${id}/endorse`),
};
