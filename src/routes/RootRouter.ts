import logger from '../utils/logger';
import express, { type Request, type Response } from 'express';

const rootRouter = express.Router();

//* GET: http://localhost:8080/api/
rootRouter.get('/', (req: Request, res: Response) => {
  logger('All Right', 'info', 'app');
  res.send('Welcome');
});

export default rootRouter;
