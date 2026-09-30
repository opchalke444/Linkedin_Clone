import prisma from '../db/prisma.js';
import { calculateProfileCompleteness } from '../utils/completeness.js';

export class UserService {
  static async getUserById(targetUserId: string, currentUserId?: string) {
    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
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
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found.');
    }

    let connectionStatus: 'SELF' | 'NONE' | 'PENDING_SENT' | 'PENDING_RECEIVED' | 'CONNECTED' = 'NONE';
    let connectionId: string | null = null;

    if (currentUserId) {
      if (currentUserId === targetUserId) {
        connectionStatus = 'SELF';
      } else {
        const connection = await prisma.connection.findFirst({
          where: {
            OR: [
              { senderId: currentUserId, receiverId: targetUserId },
              { senderId: targetUserId, receiverId: currentUserId },
            ],
          },
        });

        if (connection) {
          connectionId = connection.id;
          if (connection.status === 'ACCEPTED') {
            connectionStatus = 'CONNECTED';
          } else if (connection.senderId === currentUserId) {
            connectionStatus = 'PENDING_SENT';
          } else {
            connectionStatus = 'PENDING_RECEIVED';
          }
        }
      }
    }

    // Shared skills similarity if viewer is logged in
    let sharedSkills: string[] = [];
    if (currentUserId && currentUserId !== targetUserId) {
      const viewerSkills = await prisma.userSkill.findMany({
        where: { userId: currentUserId },
        include: { skill: true },
      });
      const viewerSkillNames = new Set(viewerSkills.map((s) => s.skill.name.toLowerCase()));
      sharedSkills = user.skills
        .map((s) => s.skill.name)
        .filter((name) => viewerSkillNames.has(name.toLowerCase()));
    }

    const { passwordHash: _, ...safeUser } = user;
    const completeness = calculateProfileCompleteness(user);

    return {
      ...safeUser,
      connectionCount: (user._count.sentConnections || 0) + (user._count.receivedConnections || 0),
      postsCount: user._count.posts || 0,
      connectionStatus,
      connectionId,
      sharedSkills,
      completeness,
    };
  }

  // Feature 2: Skill-Based Network Discovery ("People you may know")
  static async getSkillBasedRecommendations(currentUserId: string, limit = 8) {
    // 1. Get current user's skills and existing connections
    const [userSkills, existingConnections] = await Promise.all([
      prisma.userSkill.findMany({
        where: { userId: currentUserId },
        include: { skill: true },
      }),
      prisma.connection.findMany({
        where: {
          OR: [{ senderId: currentUserId }, { receiverId: currentUserId }],
        },
      }),
    ]);

    const userSkillNames = new Set(userSkills.map((s) => s.skill.name.toLowerCase()));
    const excludedUserIds = new Set<string>([
      currentUserId,
      ...existingConnections.map((c) => (c.senderId === currentUserId ? c.receiverId : c.senderId)),
    ]);

    // 2. Fetch potential candidates
    const candidates = await prisma.user.findMany({
      where: {
        id: { notIn: Array.from(excludedUserIds) },
      },
      take: 50,
      include: {
        profile: true,
        skills: {
          include: { skill: true },
        },
      },
    });

    // 3. Compute deterministic similarity score: Common Skills / Total Distinct Skills
    const scoredCandidates = candidates.map((candidate) => {
      const candidateSkillNames = candidate.skills.map((s) => s.skill.name);
      const common = candidateSkillNames.filter((name) => userSkillNames.has(name.toLowerCase()));

      const allUnique = new Set([
        ...Array.from(userSkillNames),
        ...candidateSkillNames.map((s) => s.toLowerCase()),
      ]);

      const similarityScore = allUnique.size > 0 ? Math.round((common.length / allUnique.size) * 100) : 0;

      const { passwordHash: _, ...safeCandidate } = candidate;
      return {
        ...safeCandidate,
        commonSkills: common,
        commonSkillsCount: common.length,
        similarityScore,
      };
    });

    // Sort by most common skills first, then similarity score
    scoredCandidates.sort((a, b) => {
      if (b.commonSkillsCount !== a.commonSkillsCount) {
        return b.commonSkillsCount - a.commonSkillsCount;
      }
      return b.similarityScore - a.similarityScore;
    });

    return scoredCandidates.slice(0, limit);
  }

  static async updateProfile(userId: string, data: any) {
    const { fullName, headline, location, avatarUrl, bannerUrl, ...profileData } = data;

    // Update User table fields
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(fullName && { fullName }),
        ...(headline !== undefined && { headline }),
        ...(location !== undefined && { location }),
        ...(avatarUrl !== undefined && { avatarUrl }),
        ...(bannerUrl !== undefined && { bannerUrl }),
      },
      include: {
        profile: true,
        educations: true,
        experiences: true,
        skills: { include: { skill: true } },
      },
    });

    // Update Profile table fields safely
    const allowedProfileKeys = [
      'about',
      'industry',
      'preferredRole',
      'portfolioUrl',
      'githubUrl',
      'linkedinUrl',
      'resumeUrl',
    ];
    const safeProfileData: Record<string, any> = {};
    for (const key of allowedProfileKeys) {
      if (key in profileData && profileData[key] !== undefined) {
        safeProfileData[key] = profileData[key];
      }
    }

    if (Object.keys(safeProfileData).length > 0) {
      await prisma.profile.upsert({
        where: { userId },
        create: {
          userId,
          ...safeProfileData,
        },
        update: {
          ...safeProfileData,
        },
      });
    }

    return this.getUserById(userId, userId);
  }
}
