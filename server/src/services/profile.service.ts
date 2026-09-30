import prisma from '../db/prisma.js';
import { ProficiencyLevel } from '@prisma/client';

export class ProfileService {
  // Education CRUD
  static async addEducation(userId: string, data: any) {
    return prisma.education.create({
      data: {
        userId,
        institution: data.institution,
        degree: data.degree,
        fieldOfStudy: data.fieldOfStudy,
        startYear: data.startYear,
        endYear: data.endYear,
        grade: data.grade,
        description: data.description,
      },
    });
  }

  static async updateEducation(id: string, userId: string, data: any) {
    const existing = await prisma.education.findFirst({
      where: { id, userId },
    });
    if (!existing) throw new Error('Education record not found or unauthorized.');

    return prisma.education.update({
      where: { id },
      data,
    });
  }

  static async deleteEducation(id: string, userId: string) {
    const existing = await prisma.education.findFirst({
      where: { id, userId },
    });
    if (!existing) throw new Error('Education record not found or unauthorized.');

    return prisma.education.delete({ where: { id } });
  }

  // Experience CRUD
  static async addExperience(userId: string, data: any) {
    return prisma.experience.create({
      data: {
        userId,
        company: data.company,
        position: data.position,
        location: data.location,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        currentlyWorking: Boolean(data.currentlyWorking),
        description: data.description,
      },
    });
  }

  static async updateExperience(id: string, userId: string, data: any) {
    const existing = await prisma.experience.findFirst({
      where: { id, userId },
    });
    if (!existing) throw new Error('Experience record not found or unauthorized.');

    return prisma.experience.update({
      where: { id },
      data: {
        ...data,
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.endDate !== undefined && { endDate: data.endDate ? new Date(data.endDate) : null }),
      },
    });
  }

  static async deleteExperience(id: string, userId: string) {
    const existing = await prisma.experience.findFirst({
      where: { id, userId },
    });
    if (!existing) throw new Error('Experience record not found or unauthorized.');

    return prisma.experience.delete({ where: { id } });
  }

  // Skills CRUD
  static async addSkill(userId: string, skillName: string, proficiency: ProficiencyLevel = ProficiencyLevel.INTERMEDIATE) {
    // 1. Find or create master Skill
    const normalized = skillName.trim();
    let skill = await prisma.skill.findUnique({
      where: { name: normalized },
    });

    if (!skill) {
      skill = await prisma.skill.create({
        data: { name: normalized, category: 'Technical' },
      });
    }

    // 2. Link skill to user
    const existing = await prisma.userSkill.findUnique({
      where: {
        userId_skillId: {
          userId,
          skillId: skill.id,
        },
      },
    });

    if (existing) {
      throw new Error('This skill is already on your profile.');
    }

    return prisma.userSkill.create({
      data: {
        userId,
        skillId: skill.id,
        proficiency,
      },
      include: {
        skill: true,
      },
    });
  }

  static async removeSkill(userSkillId: string, userId: string) {
    const existing = await prisma.userSkill.findFirst({
      where: { id: userSkillId, userId },
    });
    if (!existing) throw new Error('Skill not found on your profile.');

    return prisma.userSkill.delete({ where: { id: userSkillId } });
  }

  static async endorseSkill(userSkillId: string, _endorserId: string) {
    return prisma.userSkill.update({
      where: { id: userSkillId },
      data: {
        endorsements: { increment: 1 },
      },
      include: {
        skill: true,
      },
    });
  }
}
