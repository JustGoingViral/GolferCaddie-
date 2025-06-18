
import { Request, Response, NextFunction } from 'express';
import { logger } from '../logger';
import { z } from 'zod';

// Custom error class with status code
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  
  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Central error handler middleware
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = { ...err };
  error.message = err.message;
  
  // Log the error with context
  const context = {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userId: (req as any).user?.id || 'unauthenticated',
    requestBody: req.body,
    stack: err.stack
  };

  // Handle different types of errors
  if (err instanceof z.ZodError) {
    error = new AppError(`Validation error: ${err.errors.map(e => e.message).join(', ')}`, 400, true);
    logger.warn(`Validation error in request`, { ...context, validationErrors: err.errors });
  } else if (err.code === '23505') { // Postgres unique violation
    error = new AppError('A record with this data already exists', 409, true);
    logger.warn(`Database unique constraint violation`, context);
  } else if (err.code === '23503') { // Postgres foreign key violation
    error = new AppError('Referenced record does not exist', 400, true);
    logger.warn(`Database foreign key violation`, context);
  } else if (!err.isOperational) {
    // Unhandled errors are considered severe
    logger.fatal(`Unhandled error: ${err.message}`, context);
    error = new AppError('Internal server error', 500, false);
  } else {
    // Log based on status code
    if (err.statusCode >= 500) {
      logger.error(`Server error: ${err.message}`, context);
    } else {
      logger.warn(`Client error: ${err.message}`, context);
    }
  }

  // Send response
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'An unexpected error occurred',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

// Async handler to catch errors in async routes
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Route not found: ${req.originalUrl}`, 404);
  logger.warn(`404 Not Found: ${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });
  next(error);
};
