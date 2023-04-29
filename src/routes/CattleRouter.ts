import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';

// ? Controllers
import { CattleController } from '../controller/CattleController';

// ? Utils Methods
import logger from '../utils/logger';
import { validateCattle } from '../utils/validateCattle';

// ? Interfaces & Types
import { type ICattle } from '../interfaces/cattle.interface';
import { type DataResponse, type BasicResponse } from '../interfaces';

// ? Libraries
import _ from 'lodash';
import bodyParser from 'body-parser';

// ? Middlewares
import asyncMiddleware from '../middlewares/async';
import { connectDb, disconnectDb } from '../middlewares/db';
import errorHandler from '../middlewares/errorHandler';
import { type Sequelize } from 'sequelize';

// * get json from body;
const jsonParser = bodyParser.json();

const cattleRouter = express.Router();

/**
 * Cattle EndPoint:
 * * http://localhost:5000/api/cattle
 */
cattleRouter.post(
  '/',
  jsonParser,
  errorHandler,
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    let connection: Sequelize | undefined;
    connectDb()
      .then(async (sequelize?: Sequelize) => {
        connection = sequelize;
        const { error } = validateCattle(req.body);
        if (error !== undefined) {
          console.log(error);
          const { message } = error.details[0];
          res.status(400).send(message);
          next(error);
        }
        const cattleObj: ICattle = _.pick(req.body, [
          'number',
          'race',
          'initWeight',
          'quarterlyWeight',
          'register',
        ]);
        const controller: CattleController = new CattleController();
        const response: BasicResponse | undefined =
          await controller.createCattle(cattleObj, connection);
        res.status(201).send(response);
      })
      .catch(error => {
        if (error instanceof Error) {
          logger(`[CONNECTION ERROR]:${error.message}`, 'error', 'db');
          next(error);
        }
      })
      .finally(async () => {
        await disconnectDb(connection);
      });
  })
);

cattleRouter.get(
  '/',
  errorHandler,
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    let connection: Sequelize | undefined;
    connectDb()
      .then(async sequelize => {
        connection = sequelize;
        const { page, limit } = req.query;
        const id = req?.query?.id?.toString();
        let parsePage = 1;
        let parseLimit = 10;
        if (typeof page === 'string' && typeof limit === 'string') {
          logger(
            `Query Param: ${id !== undefined ? id + ',' : ''} ${page}, ${limit}`
          );
          parseLimit = parseInt(limit);
          parsePage = parseInt(page);
        }
        const controller: CattleController = new CattleController();
        const response: DataResponse | unknown | undefined =
          await controller.getCattle(parsePage, parseLimit, connection, id);
        res.status(200).send(response);
      })
      .catch(error => {
        if (error instanceof Error && error !== undefined) {
          logger(`[CONNECTION ERROR]:${error.message}`, 'error', 'db');
          next(error);
        }
      })
      .finally(async () => {
        await disconnectDb(connection);
      });
  })
);

export default cattleRouter;
