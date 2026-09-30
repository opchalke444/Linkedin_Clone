import prisma from '../db/prisma.js';
import { isUserOnline, emitToUser } from '../socket/socket.handler.js';
import { NotificationType } from '@prisma/client';

export class MessageService {
  static async getConversations(userId: string) {
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: {
        user1: {
          select: { id: true, fullName: true, avatarUrl: true, headline: true },
        },
        user2: {
          select: { id: true, fullName: true, avatarUrl: true, headline: true },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });

    // Count unread messages per conversation
    const result = await Promise.all(
      conversations.map(async (c) => {
        const peer = c.user1Id === userId ? c.user2 : c.user1;
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: c.id,
            receiverId: userId,
            isRead: false,
          },
        });

        return {
          id: c.id,
          peer: {
            ...peer,
            isOnline: isUserOnline(peer.id),
          },
          lastMessage: c.messages[0] || null,
          unreadCount,
          lastMessageAt: c.lastMessageAt,
        };
      })
    );

    return result;
  }

  static async getMessages(conversationId: string, currentUserId: string) {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        user1: { select: { id: true, fullName: true, avatarUrl: true, headline: true } },
        user2: { select: { id: true, fullName: true, avatarUrl: true, headline: true } },
      },
    });

    if (!conversation) throw new Error('Conversation not found.');
    if (conversation.user1Id !== currentUserId && conversation.user2Id !== currentUserId) {
      throw new Error('Unauthorized to view this conversation.');
    }

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        conversationId,
        receiverId: currentUserId,
        isRead: false,
      },
      data: { isRead: true },
    });

    const messages = await prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const peer = conversation.user1Id === currentUserId ? conversation.user2 : conversation.user1;

    return {
      conversationId,
      peer: {
        ...peer,
        isOnline: isUserOnline(peer.id),
      },
      messages,
    };
  }

  static async sendMessage(senderId: string, receiverId: string, content: string) {
    if (!content.trim()) throw new Error('Message content cannot be empty.');
    if (senderId === receiverId) throw new Error('You cannot message yourself.');

    const [u1, u2] = senderId < receiverId ? [senderId, receiverId] : [receiverId, senderId];

    let conversation = await prisma.conversation.findUnique({
      where: { user1Id_user2Id: { user1Id: u1, user2Id: u2 } },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { user1Id: u1, user2Id: u2 },
      });
    }

    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId,
        receiverId,
        content: content.trim(),
      },
      include: {
        sender: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
      },
    });

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() },
    });

    // Notify receiver
    const notification = await prisma.notification.create({
      data: {
        recipientId: receiverId,
        actorId: senderId,
        type: NotificationType.MESSAGE_RECEIVED,
        referenceId: conversation.id,
      },
      include: {
        actor: { select: { id: true, fullName: true, avatarUrl: true } },
      },
    });

    emitToUser(receiverId, 'message:receive', message);
    emitToUser(receiverId, 'notification:new', notification);

    return message;
  }
}
