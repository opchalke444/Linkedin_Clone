import { Server, Socket } from 'socket.io';
import prisma from '../db/prisma.js';
import { NotificationType } from '@prisma/client';

let ioInstance: Server | null = null;
const userSockets = new Map<string, Set<string>>();

export function initializeSocket(io: Server) {
  ioInstance = io;

  io.on('connection', (socket: Socket) => {
    let currentUserId: string | null = null;

    // User authentication / joining personal room
    socket.on('join', (userId: string) => {
      if (!userId) return;
      currentUserId = userId;
      socket.join(`user:${userId}`);

      if (!userSockets.has(userId)) {
        userSockets.set(userId, new Set());
      }
      userSockets.get(userId)!.add(socket.id);

      // Broadcast online status to connections
      io.emit('user:status', { userId, status: 'online' });
    });

    // 1-to-1 messaging
    socket.on('message:send', async (data: { receiverId: string; content: string }) => {
      try {
        if (!currentUserId || !data.receiverId || !data.content?.trim()) return;

        // Find or create conversation between currentUserId and receiverId
        const [u1, u2] = currentUserId < data.receiverId ? [currentUserId, data.receiverId] : [data.receiverId, currentUserId];

        let conversation = await prisma.conversation.findUnique({
          where: { user1Id_user2Id: { user1Id: u1, user2Id: u2 } },
        });

        if (!conversation) {
          conversation = await prisma.conversation.create({
            data: { user1Id: u1, user2Id: u2 },
          });
        }

        // Persist message in PostgreSQL
        const message = await prisma.message.create({
          data: {
            conversationId: conversation.id,
            senderId: currentUserId,
            receiverId: data.receiverId,
            content: data.content.trim(),
          },
          include: {
            sender: {
              select: { id: true, fullName: true, avatarUrl: true },
            },
          },
        });

        // Update conversation lastMessageAt
        await prisma.conversation.update({
          where: { id: conversation.id },
          data: { lastMessageAt: new Date() },
        });

        // Create notification for receiver
        const notification = await prisma.notification.create({
          data: {
            recipientId: data.receiverId,
            actorId: currentUserId,
            type: NotificationType.MESSAGE_RECEIVED,
            referenceId: conversation.id,
          },
          include: {
            actor: {
              select: { id: true, fullName: true, avatarUrl: true, headline: true },
            },
          },
        });

        // Emit message to recipient & sender
        io.to(`user:${data.receiverId}`).emit('message:receive', message);
        socket.emit('message:sent', message);

        // Emit notification
        io.to(`user:${data.receiverId}`).emit('notification:new', notification);
      } catch (err) {
        console.error('[Socket] Error sending message:', err);
        socket.emit('message:error', { message: 'Failed to send message.' });
      }
    });

    // Typing indicators
    socket.on('typing:start', (data: { receiverId: string }) => {
      if (currentUserId && data.receiverId) {
        io.to(`user:${data.receiverId}`).emit('typing:indicator', {
          senderId: currentUserId,
          isTyping: true,
        });
      }
    });

    socket.on('typing:stop', (data: { receiverId: string }) => {
      if (currentUserId && data.receiverId) {
        io.to(`user:${data.receiverId}`).emit('typing:indicator', {
          senderId: currentUserId,
          isTyping: false,
        });
      }
    });

    // Disconnect handling
    socket.on('disconnect', () => {
      if (currentUserId && userSockets.has(currentUserId)) {
        const sockets = userSockets.get(currentUserId)!;
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          userSockets.delete(currentUserId);
          io.emit('user:status', { userId: currentUserId, status: 'offline' });
        }
      }
    });
  });
}

export function emitToUser(userId: string, event: string, data: any) {
  if (ioInstance) {
    ioInstance.to(`user:${userId}`).emit(event, data);
  }
}

export function isUserOnline(userId: string): boolean {
  return Boolean(userSockets.has(userId) && userSockets.get(userId)!.size > 0);
}

export function getOnlineUsers(): string[] {
  return Array.from(userSockets.keys());
}
