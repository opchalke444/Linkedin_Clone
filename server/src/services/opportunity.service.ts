import prisma from '../db/prisma.js';

export class OpportunityService {
  static async getOpportunities(currentUserId?: string) {
    const opportunities = await prisma.opportunity.findMany({
      include: {
        ...(currentUserId && {
          applications: {
            where: { userId: currentUserId },
            select: { id: true, status: true, appliedAt: true },
          },
        }),
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!currentUserId) {
      return opportunities.map((opp) => ({
        ...opp,
        matchScore: 0,
        matchingSkills: [],
        missingSkills: opp.requiredSkills.split(',').map((s) => s.trim()),
        hasApplied: false,
      }));
    }

    // Fetch user skills and preferred role
    const user = await prisma.user.findUnique({
      where: { id: currentUserId },
      include: {
        profile: true,
        skills: { include: { skill: true } },
      },
    });

    const userSkillNames = new Set(
      (user?.skills || []).map((s) => s.skill.name.toLowerCase().trim())
    );

    // Score each opportunity deterministically
    const matchedOpportunities = opportunities.map((opp) => {
      const requiredList = opp.requiredSkills
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const matchingSkills: string[] = [];
      const missingSkills: string[] = [];

      for (const reqSkill of requiredList) {
        if (userSkillNames.has(reqSkill.toLowerCase())) {
          matchingSkills.push(reqSkill);
        } else {
          missingSkills.push(reqSkill);
        }
      }

      const matchRatio = requiredList.length > 0 ? matchingSkills.length / requiredList.length : 0;
      let matchScore = Math.round(matchRatio * 100);

      // Check role keyword bonus (+5% if preferred role matches title)
      if (
        user?.profile?.preferredRole &&
        opp.title.toLowerCase().includes(user.profile.preferredRole.toLowerCase())
      ) {
        matchScore = Math.min(100, matchScore + 5);
      }

      const hasApplied = Array.isArray(opp.applications) && opp.applications.length > 0;
      const applicationDetails = hasApplied ? opp.applications[0] : null;

      return {
        ...opp,
        matchScore,
        matchingSkills,
        missingSkills,
        hasApplied,
        applicationDetails,
        applications: undefined,
      };
    });

    // Sort by matchScore descending
    matchedOpportunities.sort((a, b) => b.matchScore - a.matchScore);

    return matchedOpportunities;
  }

  static async applyToOpportunity(opportunityId: string, userId: string) {
    const opp = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
    });
    if (!opp) throw new Error('Opportunity not found.');

    const existing = await prisma.opportunityApplication.findUnique({
      where: { opportunityId_userId: { opportunityId, userId } },
    });
    if (existing) throw new Error('You have already applied to this opportunity.');

    return prisma.opportunityApplication.create({
      data: {
        opportunityId,
        userId,
        status: 'SUBMITTED',
      },
      include: {
        opportunity: true,
      },
    });
  }
}
