import express from "express";

type Handler<T = express.Request, U = express.Response> = (
  req: T,
  res: U,
  next: express.NextFunction,
) => Promise<void>;

export const asyncWrapper = <T = express.Request, U = express.Response>(handler: Handler<T, U>) => {
  return (req: T, res: U, next: express.NextFunction) => {
    handler(req, res, next)
    .catch(next);
  }
}
