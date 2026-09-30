import api from './client';
import { ConversationItem, MessageItem } from '../types';

export const messageApi = {
  getConversations: (): Promise<{ success: boolean; data: ConversationItem[] }> =>
    api.get('/messages/conversations'),

  getMessages: (conversationId: string): Promise<{ success: boolean; data: { conversationId: string; peer: any; messages: MessageItem[] } }> =>
    api.get(`/messages/conversations/${conversationId}`),

  sendMessage: (receiverId: string, content: string): Promise<{ success: boolean; data: MessageItem }> =>
    api.post('/messages', { receiverId, content }),
};
