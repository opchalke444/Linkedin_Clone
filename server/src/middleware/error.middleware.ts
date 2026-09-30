import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { sendError } from '../utils/api-response.js';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): any {
  console.error('[Error caught in centralized handler]:', err);

  // 1. Zod Validation Error
  if (err instanceof ZodError) {
    const messages = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
    return sendError(res, `Validation Error: ${messages.join('; ')}`, 400, err.errors);
  }

  // 2. Prisma Database Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[]) || [];
      return sendError(res, `A record with this ${target.join(', ') || 'field'} already exists.`, 409);
    }
    if (err.code === 'P2025') {
      return sendError(res, 'The requested resource was not found.', 404);
    }
    if (err.code === 'P2003') {
      return sendError(res, 'Database relation constraint failed.', 400);
    }
  }

  // 3. Multer Upload Error
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return sendError(res, 'File size exceeds maximum limit of 5MB.', 400);
    }
    return sendError(res, `File upload error: ${err.message}`, 400);
  }

  // 4. AppError or Operational Error with statusCode
  if (err.statusCode || err.status) {
    return sendError(res, err.message, err.statusCode || err.status, err.details);
  }

  // 5. Standard Error with meaningful validation or business logic message
  if (err instanceof Error) {
    const isClientError =
      err.message.includes('already') ||
      err.message.includes('Invalid') ||
      err.message.includes('cannot') ||
      err.message.includes('Unauthorized') ||
      err.message.includes('not found');

    const statusCode = isClientError ? 400 : 500;
    const message =
      process.env.NODE_ENV === 'production' && statusCode === 500
        ? 'An unexpected internal server error occurred.'
        : err.message;

    return sendError(res, message, statusCode);
  }

  // Fallback
  return sendError(res, 'Internal Server Error', 500);
}
