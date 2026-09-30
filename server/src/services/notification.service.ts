import prisma from '../db/prisma.js';

export class NotificationService {
  static async getNotifications(userId: string, limit = 20) {
    const notifications = await prisma.notification.findMany({
      where: { recipientId: userId },
      include: {
        actor: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            headline: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const unreadCount = await prisma.notification.count({
      where: { recipientId: userId, isRead: false },
    });

    return { notifications, unreadCount };
  }

  static async markAsRead(notificationId: string, userId: string) {
    const notif = await prisma.notification.findUnique({
      where: { id: notificationId },
    });
    if (!notif) throw new Error('Notification not found.');
    if (notif.recipientId !== userId) throw new Error('Unauthorized.');

    return prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  static async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { recipientId: userId, isRead: false },
      data: { isRead: true },
    });
  }
}
