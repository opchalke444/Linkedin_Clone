import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    fullName: z
      .string({ required_error: 'Full name is required' })
      .trim()
      .min(2, 'Full name must be at least 2 characters')
      .max(80, 'Full name cannot exceed 80 characters'),
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email('Please enter a valid email address')
      .toLowerCase(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    headline: z.string().trim().max(120).optional(),
    location: z.string().trim().max(100).optional(),
    dateOfBirth: z.string().optional(),
    avatarUrl: z.string().url().optional().or(z.literal('')),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email('Please enter a valid email address')
      .toLowerCase(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(1, 'Password is required'),
  }),
});
