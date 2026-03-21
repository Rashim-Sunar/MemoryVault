import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

export const requireAuth = ClerkExpressRequireAuth({
  onError: (err: unknown) => {
    console.error('Auth error:', err);
    return { status: 401, message: 'Unauthorized' };
  }
}) as unknown as RequestHandler;

export const notFound = (_req: Request, res: Response): void => {
  res.status(404).json({ success: false, error: 'Route not found' });
};

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  const message = err instanceof Error ? err.message : 'Internal server error';
  res.status(500).json({ success: false, error: message });
};
