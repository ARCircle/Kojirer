import { ApiError } from '@/utils/ApiError';
import express from 'express';

export const errorHandler = (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // エラー文をそのまま出力
  // クライアントには表示されない
  console.error(err);

  if (res.headersSent) return next(err);

  if (err instanceof ApiError) {
    return res.status(err.schema.status).send(err.schema);
  }
  
  return res.status(500).send(ApiError.internalProblems());
}