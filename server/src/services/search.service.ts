import prisma from '../db/prisma.js';

export class SearchService {
  static async search(params: {
    q?: string;
    type?: 'all' | 'users' | 'posts' | 'groups' | 'skills';
    location?: string;
    industry?: string;
    skill?: string;
    currentUserId?: string;
    limit?: number;
  }) {
    const q = params.q?.trim() || '';
    const type = params.type || 'all';
    const limit = params.limit || 15;

    const results: {
      users: any[];
      posts: any[];
      groups: any[];
      skills: any[];
    } = {
      users: [],
      posts: [],
      groups: [],
      skills: [],
    };

    // 1. Search Users
    if (type === 'all' || type === 'users') {
      const userConditions: any[] = [];

      if (q) {
        userConditions.push({
          OR: [
            { fullName: { contains: q, mode: 'insensitive' } },
            { headline: { contains: q, mode: 'insensitive' } },
            { email: { contains: q, mode: 'insensitive' } },
          ],
        });
      }

      if (params.location) {
        userConditions.push({
          location: { contains: params.location, mode: 'insensitive' },
        });
      }

      if (params.industry) {
        userConditions.push({
          profile: {
            industry: { contains: params.industry, mode: 'insensitive' },
          },
        });
      }

      if (params.skill) {
        userConditions.push({
          skills: {
            some: {
              skill: {
                name: { contains: params.skill, mode: 'insensitive' },
              },
            },
          },
        });
      }

      results.users = await prisma.user.findMany({
        where: userConditions.length > 0 ? { AND: userConditions } : {},
        select: {
          id: true,
          fullName: true,
          headline: true,
          avatarUrl: true,
          location: true,
          profile: { select: { industry: true, preferredRole: true } },
          skills: {
            include: { skill: true },
            take: 4,
          },
        },
        take: limit,
      });
    }

    // 2. Search Posts
    if (type === 'all' || type === 'posts') {
      const postConditions: any[] = [];
      if (q) {
        postConditions.push({
          OR: [
            { content: { contains: q, mode: 'insensitive' } },
            { tags: { contains: q, mode: 'insensitive' } },
          ],
        });
      }

      results.posts = await prisma.post.findMany({
        where: postConditions.length > 0 ? { AND: postConditions } : {},
        include: {
          author: {
            select: { id: true, fullName: true, avatarUrl: true, headline: true },
          },
          _count: { select: { reactions: true, comments: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
    }

    // 3. Search Groups
    if (type === 'all' || type === 'groups') {
      results.groups = await prisma.group.findMany({
        where: q
          ? {
              OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {},
        take: limit,
      });
    }

    // 4. Search Skills
    if (type === 'all' || type === 'skills') {
      results.skills = await prisma.skill.findMany({
        where: q ? { name: { contains: q, mode: 'insensitive' } } : {},
        include: {
          _count: { select: { users: true } },
        },
        take: limit,
      });
    }

    return results;
  }
}
