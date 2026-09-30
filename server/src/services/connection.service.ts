import prisma from '../db/prisma.js';
import { ConnectionStatus, NotificationType } from '@prisma/client';
import { emitToUser } from '../socket/socket.handler.js';

export class ConnectionService {
  static async sendRequest(senderId: string, receiverId: string) {
    if (senderId === receiverId) {
      throw new Error('You cannot connect with yourself.');
    }

    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { id: true, fullName: true },
    });
    if (!receiver) {
      throw new Error('Target user does not exist.');
    }

    // Check existing connection in either direction
    const existing = await prisma.connection.findFirst({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
    });

    if (existing) {
      if (existing.status === ConnectionStatus.ACCEPTED) {
        throw new Error('You are already connected with this user.');
      }
      if (existing.senderId === senderId && existing.status === ConnectionStatus.PENDING) {
        throw new Error('A connection request has already been sent to this user.');
      }
      if (existing.senderId === receiverId && existing.status === ConnectionStatus.PENDING) {
        // Automatically accept reverse request
        return this.acceptRequest(existing.id, senderId);
      }
      // If rejected, delete and recreate
      await prisma.connection.delete({ where: { id: existing.id } });
    }

    const connection = await prisma.connection.create({
      data: {
        senderId,
        receiverId,
        status: ConnectionStatus.PENDING,
      },
      include: {
        receiver: {
          select: { id: true, fullName: true, avatarUrl: true, headline: true },
        },
      },
    });

    // Create Notification for receiver
    const notification = await prisma.notification.create({
      data: {
        recipientId: receiverId,
        actorId: senderId,
        type: NotificationType.CONNECTION_REQUEST,
        referenceId: connection.id,
      },
      include: {
        actor: {
          select: { id: true, fullName: true, avatarUrl: true, headline: true },
        },
      },
    });

    // Real-time socket notification
    emitToUser(receiverId, 'notification:new', notification);

    return connection;
  }

  static async acceptRequest(connectionId: string, currentUserId: string) {
    const connection = await prisma.connection.findUnique({
      where: { id: connectionId },
    });

    if (!connection) {
      throw new Error('Connection request not found.');
    }

    if (connection.receiverId !== currentUserId) {
      throw new Error('Unauthorized to accept this connection request.');
    }

    if (connection.status === ConnectionStatus.ACCEPTED) {
      return connection;
    }

    const updated = await prisma.connection.update({
      where: { id: connectionId },
      data: { status: ConnectionStatus.ACCEPTED },
      include: {
        sender: {
          select: { id: true, fullName: true, avatarUrl: true, headline: true },
        },
      },
    });

    // Notify sender that their request was accepted
    const notification = await prisma.notification.create({
      data: {
        recipientId: connection.senderId,
        actorId: currentUserId,
        type: NotificationType.CONNECTION_ACCEPTED,
        referenceId: connection.id,
      },
      include: {
        actor: {
          select: { id: true, fullName: true, avatarUrl: true, headline: true },
        },
      },
    });

    emitToUser(connection.senderId, 'notification:new', notification);

    return updated;
  }

  static async rejectRequest(connectionId: string, currentUserId: string) {
    const connection = await prisma.connection.findUnique({
      where: { id: connectionId },
    });

    if (!connection) {
      throw new Error('Connection request not found.');
    }

    if (connection.receiverId !== currentUserId) {
      throw new Error('Unauthorized to reject this connection request.');
    }

    return prisma.connection.delete({
      where: { id: connectionId },
    });
  }

  static async cancelRequest(connectionId: string, currentUserId: string) {
    const connection = await prisma.connection.findUnique({
      where: { id: connectionId },
    });

    if (!connection) {
      throw new Error('Connection request not found.');
    }

    if (connection.senderId !== currentUserId) {
      throw new Error('Unauthorized to cancel this request.');
    }

    return prisma.connection.delete({
      where: { id: connectionId },
    });
  }

  static async removeConnection(connectionId: string, currentUserId: string) {
    const connection = await prisma.connection.findUnique({
      where: { id: connectionId },
    });

    if (!connection) {
      throw new Error('Connection not found.');
    }

    if (connection.senderId !== currentUserId && connection.receiverId !== currentUserId) {
      throw new Error('Unauthorized to remove this connection.');
    }

    return prisma.connection.delete({
      where: { id: connectionId },
    });
  }

  static async getMyConnections(userId: string) {
    const connections = await prisma.connection.findMany({
      where: {
        status: ConnectionStatus.ACCEPTED,
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            email: true,
            headline: true,
            avatarUrl: true,
            location: true,
            skills: { include: { skill: true } },
          },
        },
        receiver: {
          select: {
            id: true,
            fullName: true,
            email: true,
            headline: true,
            avatarUrl: true,
            location: true,
            skills: { include: { skill: true } },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return connections.map((c) => {
      const isSender = c.senderId === userId;
      const peer = isSender ? c.receiver : c.sender;
      return {
        connectionId: c.id,
        connectedAt: c.updatedAt,
        user: peer,
      };
    });
  }

  static async getPendingRequests(userId: string) {
    const [received, sent] = await Promise.all([
      prisma.connection.findMany({
        where: { receiverId: userId, status: ConnectionStatus.PENDING },
        include: {
          sender: {
            select: {
              id: true,
              fullName: true,
              headline: true,
              avatarUrl: true,
              location: true,
              skills: { include: { skill: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.connection.findMany({
        where: { senderId: userId, status: ConnectionStatus.PENDING },
        include: {
          receiver: {
            select: {
              id: true,
              fullName: true,
              headline: true,
              avatarUrl: true,
              location: true,
              skills: { include: { skill: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { received, sent };
  }
}
