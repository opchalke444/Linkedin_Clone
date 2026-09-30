import jwt from 'jsonwebtoken';
import { CookieOptions } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'linkedin_dev_secret_key_84719273891273918237912';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}

export const AUTH_COOKIE_NAME = 'linkedin_token';

export const authCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};
