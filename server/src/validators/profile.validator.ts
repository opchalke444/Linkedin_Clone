import { z } from 'zod';
import { ProficiencyLevel } from '@prisma/client';

export const updateProfileSchema = z.object({
  body: z.object({
    fullName: z.string().trim().min(2).max(80).optional(),
    headline: z.string().trim().max(150).optional().nullable(),
    location: z.string().trim().max(100).optional().nullable(),
    avatarUrl: z.string().optional().nullable(),
    bannerUrl: z.string().optional().nullable(),
    about: z.string().trim().max(3000).optional().nullable(),
    industry: z.string().trim().max(100).optional().nullable(),
    preferredRole: z.string().trim().max(100).optional().nullable(),
    portfolioUrl: z.string().url().optional().nullable().or(z.literal('')),
    githubUrl: z.string().url().optional().nullable().or(z.literal('')),
    linkedinUrl: z.string().url().optional().nullable().or(z.literal('')),
  }),
});

export const addEducationSchema = z.object({
  body: z.object({
    institution: z.string().trim().min(2, 'Institution name is required'),
    degree: z.string().trim().min(2, 'Degree is required'),
    fieldOfStudy: z.string().trim().min(2, 'Field of study is required'),
    startYear: z.number().int().min(1950).max(2035),
    endYear: z.number().int().min(1950).max(2035).optional().nullable(),
    grade: z.string().trim().optional().nullable(),
    description: z.string().trim().max(1000).optional().nullable(),
  }),
});

export const addExperienceSchema = z.object({
  body: z.object({
    company: z.string().trim().min(2, 'Company name is required'),
    position: z.string().trim().min(2, 'Position title is required'),
    location: z.string().trim().optional().nullable(),
    startDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)),
    endDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)).optional().nullable(),
    currentlyWorking: z.boolean().default(false),
    description: z.string().trim().max(2000).optional().nullable(),
  }),
});

export const addSkillSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Skill name is required').max(50),
    proficiency: z.nativeEnum(ProficiencyLevel).default(ProficiencyLevel.INTERMEDIATE),
  }),
});
