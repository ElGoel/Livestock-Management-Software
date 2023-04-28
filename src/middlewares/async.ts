import { type Request, type Response, type NextFunction } from 'express';

const asyncMiddleware = (handler: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res);
    } catch (ex) {
      next(ex);
    }
  };
};

export default asyncMiddleware;
