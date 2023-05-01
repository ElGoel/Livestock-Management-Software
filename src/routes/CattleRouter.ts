import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';

// ? Controllers
import { CattleController } from '../controller/CattleController';

// ? Utils Methods
import logger from '../utils/logger';
import {
  validateCreateCattle,
  validateUpdateCattle,
} from '../utils/validateCattle';

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
        const { error } = validateCreateCattle(req.body);
        if (error !== undefined) {
          console.log(error);
          const { message } = error.details[0];
          res.status(400).send(message);
          next(error);
        }
        const cattleObj: ICattle = _.pick(req.body, [
          'id',
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
          logger(`[ROUTER ERROR]:${error.message}`, 'error', 'db');
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
        const limit = req?.query?.limit?.toString();
        const page = req?.query?.page?.toString();
        let parsePage = 1;
        let parseLimit = 10;
        if (page !== undefined && limit !== undefined) {
          logger(`Query Param: ${page}, ${limit}`);
          parseLimit = parseInt(limit);
          parsePage = parseInt(page);
        }
        const controller: CattleController = new CattleController();
        const response: DataResponse | unknown | undefined =
          await controller.getCattle(parsePage, parseLimit, connection);
        res.status(200).send(response);
      })
      .catch(error => {
        if (error instanceof Error && error !== undefined) {
          logger(`[ROUTER ERROR]:${error.message}`, 'error', 'db');
          next(error);
        }
      })
      .finally(async () => {
        await disconnectDb(connection);
      });
  })
);

cattleRouter.get(
  '/:id',
  errorHandler,
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    let connection: Sequelize | undefined;
    connectDb()
      .then(async sequelize => {
        connection = sequelize;
        const number = parseInt(req.params.id);
        const controller: CattleController = new CattleController();
        const response = await controller.getCattleById(number, connection);

        if (response !== null) {
          res.status(200).send(response);
        } else {
          res.status(404).send(`The user with ID: ${number} does not exist`);
        }
      })
      .catch(error => {
        if (error instanceof Error && error !== undefined) {
          logger(`[ROUTER ERROR]:${error.message}`, 'error', 'db');
          next(error);
        }
      })
      .finally(async () => {
        await disconnectDb(connection);
      });
  })
);

cattleRouter.put(
  '/:id',
  jsonParser,
  errorHandler,
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    let connection: Sequelize | undefined;
    connectDb()
      .then(async sequelize => {
        connection = sequelize;
        const id = parseInt(req.params.id);
        const cattle: ICattle = req.body;
        if (_.isEmpty(cattle)) {
          res
            .status(400)
            .send(
              'at least one filled field is needed to be able to update the entity'
            );
          logger(
            'at least one filled field is needed to be able to update the entity'
          );
        }
        const { error } = validateUpdateCattle(req.body);
        if (error !== undefined) {
          console.log(error);
          const { message } = error.details[0];
          res.status(400).send(message);
          next(error);
        }
        const controller: CattleController = new CattleController();
        const response = await controller.updateCattle(id, cattle, connection);
        if (response !== undefined) {
          res.status(response.status).send(response.message);
        } else {
          logger('something went wrong in the Controller', 'warn', 'users');
        }
      })
      .catch(error => {
        if (error instanceof Error && error !== undefined) {
          logger(`[ROUTER ERROR]:${error.message}`, 'error', 'db');
          next(error);
        }
      })
      .finally(async () => {
        await disconnectDb(connection);
      });
  })
);

export default cattleRouter;
