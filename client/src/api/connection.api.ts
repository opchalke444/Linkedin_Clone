import api from './client';
import { ConnectionItem, PendingRequestItem } from '../types';

export const connectionApi = {
  getMyConnections: (): Promise<{ success: boolean; data: ConnectionItem[] }> =>
    api.get('/connections/my'),

  getPendingRequests: (): Promise<{ success: boolean; data: { received: PendingRequestItem[]; sent: PendingRequestItem[] } }> =>
    api.get('/connections/pending'),

  sendRequest: (userId: string): Promise<{ success: boolean; data: any }> =>
    api.post(`/connections/request/${userId}`),

  acceptRequest: (connectionId: string): Promise<{ success: boolean; data: any }> =>
    api.put(`/connections/${connectionId}/accept`),

  rejectRequest: (connectionId: string): Promise<{ success: boolean }> =>
    api.put(`/connections/${connectionId}/reject`),

  cancelRequest: (connectionId: string): Promise<{ success: boolean }> =>
    api.delete(`/connections/${connectionId}/cancel`),

  removeConnection: (connectionId: string): Promise<{ success: boolean }> =>
    api.delete(`/connections/${connectionId}`),
};
