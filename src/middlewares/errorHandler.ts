import logger from '../utils/logger';
import { type NextFunction, type Request, type Response } from 'express';

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger(`[ENDPOINT ERROR]: ${err.message}`, 'error', 'db');
  res.status(500).send('Internal Server Error');
  next(err);
};

export default errorHandler;
