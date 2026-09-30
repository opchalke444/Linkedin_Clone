import api from './client';
import { NotificationItem } from '../types';

export const notificationApi = {
  getNotifications: (): Promise<{ success: boolean; data: { notifications: NotificationItem[]; unreadCount: number } }> =>
    api.get('/notifications'),

  markAsRead: (id: string): Promise<{ success: boolean; data: NotificationItem }> =>
    api.put(`/notifications/${id}/read`),

  markAllAsRead: (): Promise<{ success: boolean }> =>
    api.put('/notifications/read-all'),
};
