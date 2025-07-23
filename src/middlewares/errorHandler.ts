import { NextFunction, Request, Response } from 'express';
import { logger } from '../wistonLogger/logger';

/**
 * Middleware to handle errors
 * @param {Error} error
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  /* Logger Added */

 logger.error({
    method: req.method,
    url: req.originalUrl,
    userAgent: req.headers['user-agent'],
    status: 500,
    message: err.message
  });

  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};
