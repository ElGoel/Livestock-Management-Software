/**
 ** Root Router
 ** Redirection to Routers
 */
import express, { type Request, type Response } from 'express';
import logger from '../utils/logger';
import cattleRouter from './CattleRouter';

// Server Instance
const app = express();

// Router Instance
const rootRouter = express.Router();

//* Activate for requests to http://localhost:8080/api/

//* GET: http://localhost:8080/api/
rootRouter.get('/', (req: Request, res: Response) => {
  logger('All Right', 'info', 'app');
  res.send('Welcome');
});

//* Redirection to Routers & Controllers
app.use('/', rootRouter); // ? http://localhost:8080/api/
app.use('/cattle', cattleRouter); // ? http://localhost:8080/api/cattle

//* Add more routes to the server

export default app;
