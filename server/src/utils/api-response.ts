import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: any;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200,
  meta?: any
): Response {
  const body: ApiResponse<T> = {
    success: true,
    ...(message && { message }),
    data,
    ...(meta && { meta }),
  };
  return res.status(statusCode).json(body);
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 400,
  details?: any
): Response {
  const body: ApiResponse = {
    success: false,
    message,
    ...(details && { meta: details }),
  };
  return res.status(statusCode).json(body);
}
