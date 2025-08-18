import { ApiError } from '@/utils/ApiError';
import express from 'express';
import { logger } from '@/utils/logger';

export const errorHandler: express.ErrorRequestHandler = (
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  // エラー文をそのまま出力
  // クライアントには表示されない
  logger.error('Error occurred', {
    error: err.message || err,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  if (res.headersSent) return next(err);

  if (err instanceof ApiError) {
    res.status(err.schema.status).send(err.schema);
    return;
  }

  res.status(500).send(ApiError.internalProblems());
};
