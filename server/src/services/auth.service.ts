import bcrypt from 'bcryptjs';
import prisma from '../db/prisma.js';
import { generateToken } from '../utils/jwt.js';
import { calculateProfileCompleteness } from '../utils/completeness.js';

export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
  headline?: string;
  location?: string;
  dateOfBirth?: string;
  avatarUrl?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export class AuthService {
  static async register(dto: RegisterDto) {
    const existing = await prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const user = await prisma.user.create({
      data: {
        fullName: dto.fullName,
        email: dto.email.toLowerCase(),
        passwordHash,
        headline: dto.headline || 'Member on LinkedIn',
        location: dto.location || 'Global',
        avatarUrl: dto.avatarUrl || null,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
        profile: {
          create: {
            about: '',
            profileCompleteness: 35,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, token };
  }

  static async login(dto: LoginDto) {
    const user = await prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: {
        profile: true,
        skills: {
          include: { skill: true },
        },
      },
    });

    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, token };
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        educations: { orderBy: { startYear: 'desc' } },
        experiences: { orderBy: { startDate: 'desc' } },
        skills: {
          include: { skill: true },
          orderBy: { endorsements: 'desc' },
        },
        _count: {
          select: {
            sentConnections: { where: { status: 'ACCEPTED' } },
            receivedConnections: { where: { status: 'ACCEPTED' } },
            posts: true,
            notificationsReceived: { where: { isRead: false } },
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found.');
    }

    const completeness = calculateProfileCompleteness(user);

    // Update profile completeness in background if changed
    if (user.profile && user.profile.profileCompleteness !== completeness.percentage) {
      await prisma.profile.update({
        where: { id: user.profile.id },
        data: { profileCompleteness: completeness.percentage },
      }).catch(() => {});
    }

    const { passwordHash: _, ...safeUser } = user;
    const connectionCount =
      (user._count.sentConnections || 0) + (user._count.receivedConnections || 0);

    return {
      ...safeUser,
      connectionCount,
      unreadNotificationsCount: user._count.notificationsReceived || 0,
      completeness,
    };
  }
}
