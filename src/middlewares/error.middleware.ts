import { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/errors';
import { logger } from '../utils/logger';
import { config } from '../config';

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (config.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    sendErrorProd(err, res);
  }
};

const sendErrorDev = (err: any, res: Response) => {
  logger.error('ERROR 💥', err);
  res.status(err.statusCode).json({
    success: false,
    error: {
      code: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    },
  });
};

const sendErrorProd = (err: any, res: Response) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.status,
        message: err.message,
      },
    });
  } 
  // Programming or other unknown error: don't leak error details
  else {
    logger.error('ERROR 💥', err);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went very wrong!',
      },
    });
  }
};
