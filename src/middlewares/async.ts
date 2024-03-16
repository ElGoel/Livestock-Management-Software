import { type Request, type Response, type NextFunction } from 'express';

const asyncMiddleware = (
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (ex) {
      if (ex !== undefined) {
        next(ex);
      }
    }
  };
};

export default asyncMiddleware;
