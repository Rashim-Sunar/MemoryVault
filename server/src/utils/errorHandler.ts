import type { Request, Response, NextFunction } from 'express';
import { ApiError, ValidationError } from '../types/errors.js';

export const asyncHandler =
  <T extends Request>(fn: (req: T, res: Response, next: NextFunction) => Promise<void>) =>
  (req: T, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };

export const validateRequired = (payload: Record<string, unknown>, keys: string[]): void => {
  const missing = keys.filter((key) => payload[key] === undefined || payload[key] === null || payload[key] === '');
  if (missing.length > 0) {
    throw new ValidationError(`Missing required fields: ${missing.join(', ')}`);
  }
};

export const handleApiError = (error: unknown, res: Response): void => {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({ success: false, error: error.message, details: error.details });
    return;
  }

  const message = error instanceof Error ? error.message : 'Internal server error';
  res.status(500).json({ success: false, error: message });
};
