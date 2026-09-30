import prisma from '../db/prisma.js';
import { GroupRole } from '@prisma/client';

export class GroupService {
  static async getAllGroups(currentUserId?: string) {
    const groups = await prisma.group.findMany({
      include: {
        creator: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
        _count: { select: { members: true, posts: true } },
        ...(currentUserId && {
          members: {
            where: { userId: currentUserId },
            select: { role: true },
          },
        }),
      },
      orderBy: { memberCount: 'desc' },
    });

    return groups.map((g) => ({
      ...g,
      isMember: currentUserId ? Array.isArray(g.members) && g.members.length > 0 : false,
      myRole: currentUserId && Array.isArray(g.members) && g.members.length > 0 ? g.members[0].role : null,
      members: undefined,
    }));
  }

  static async getGroupBySlug(slug: string, currentUserId?: string) {
    const group = await prisma.group.findUnique({
      where: { slug },
      include: {
        creator: { select: { id: true, fullName: true, avatarUrl: true } },
        members: {
          include: {
            user: { select: { id: true, fullName: true, avatarUrl: true, headline: true } },
          },
          take: 20,
        },
        posts: {
          include: {
            author: { select: { id: true, fullName: true, avatarUrl: true, headline: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: { select: { members: true, posts: true } },
      },
    });

    if (!group) throw new Error('Group not found.');

    const membership = currentUserId
      ? await prisma.groupMember.findUnique({
          where: { groupId_userId: { groupId: group.id, userId: currentUserId } },
        })
      : null;

    return {
      ...group,
      isMember: Boolean(membership),
      myRole: membership?.role || null,
    };
  }

  static async createGroup(creatorId: string, data: { name: string; description: string; avatarUrl?: string; bannerUrl?: string }) {
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const group = await prisma.group.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        avatarUrl: data.avatarUrl || null,
        bannerUrl: data.bannerUrl || null,
        creatorId,
        memberCount: 1,
        members: {
          create: {
            userId: creatorId,
            role: GroupRole.ADMIN,
          },
        },
      },
      include: {
        creator: { select: { id: true, fullName: true, avatarUrl: true } },
      },
    });

    return group;
  }

  static async joinGroup(groupId: string, userId: string) {
    const existing = await prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId } },
    });
    if (existing) throw new Error('You are already a member of this group.');

    const member = await prisma.groupMember.create({
      data: {
        groupId,
        userId,
        role: GroupRole.MEMBER,
      },
    });

    await prisma.group.update({
      where: { id: groupId },
      data: { memberCount: { increment: 1 } },
    });

    return member;
  }

  static async leaveGroup(groupId: string, userId: string) {
    const group = await prisma.group.findUnique({ where: { id: groupId } });
    if (!group) throw new Error('Group not found.');
    if (group.creatorId === userId) {
      throw new Error('Group creator cannot leave the group. You can delete the group instead.');
    }

    const member = await prisma.groupMember.delete({
      where: { groupId_userId: { groupId, userId } },
    });

    await prisma.group.update({
      where: { id: groupId },
      data: { memberCount: { decrement: 1 } },
    });

    return member;
  }

  static async createGroupPost(groupId: string, authorId: string, content: string, imageUrl?: string) {
    // Check membership
    const membership = await prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId: authorId } },
    });
    if (!membership) {
      throw new Error('You must be a member of this group to post.');
    }

    return prisma.groupPost.create({
      data: {
        groupId,
        authorId,
        content,
        imageUrl: imageUrl || null,
      },
      include: {
        author: { select: { id: true, fullName: true, avatarUrl: true, headline: true } },
      },
    });
  }
}
