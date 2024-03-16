import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';

// ? Controller
import { LotsController } from '../controller/LotsController';

// ? Utils Methods
import logger from '../utils/logger';
import {
  validateCreateLots /* , validateUpdateLots */,
  validateUpdateLots,
} from '../utils/validations/validateLots';

// ? Interfaces & Types
import {
  type IProducts,
  type DataResponse,
  type ILots /* , type DataResponse */,
} from '../interfaces';

// ? Libraries
import _ from 'lodash';
import bodyParser from 'body-parser';

// ? Middlewares
import asyncMiddleware from '../middlewares/async';
import connectDb from '../middlewares/connectDb';
import disconnectDb from '../middlewares/disconnectDb';
import errorHandler from '../middlewares/errorHandler';
import { type Sequelize } from 'sequelize';
import { type CreateResult } from '../types/PromiseTypeResponse';

// * get json from body;
const jsonParser = bodyParser.json();

const lotsRouter = express.Router();

/**
 * Lots EndPoint:
 * * http://localhost:5000/api/lots
 */

lotsRouter.post(
  '/',
  jsonParser,
  errorHandler,
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    let connection: Sequelize | undefined;
    connectDb()
      .then(async (sequelize?: Sequelize) => {
        connection = sequelize;
        const { error } = validateCreateLots(req.body);
        if (error !== undefined) {
          console.error(error);
          const { message } = error.details[0];
          res.status(400).send(message);
          next(error);
        } else {
          const lotsObj = _.pick(req.body, [
            'name',
            'supplier',
            'receiveDate',
            'register',
          ]);
          const controller: LotsController = new LotsController();
          const response: CreateResult<IProducts> = await controller.createLot(
            lotsObj,
            connection
          );
          if (response !== undefined) {
            res.status(response.status).send(response);
          }
        }
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

lotsRouter.get(
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
        const controller: LotsController = new LotsController();
        const response: DataResponse<ILots> | unknown | undefined =
          await controller.getLots(parsePage, parseLimit, connection);
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

lotsRouter.get(
  '/:id',
  errorHandler,
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    let connection: Sequelize | undefined;
    connectDb()
      .then(async sequelize => {
        connection = sequelize;
        const number = parseInt(req.params.id);
        const controller: LotsController = new LotsController();
        const response = await controller.getLotById(number, connection);

        if (response !== null) {
          res.status(200).send(response);
        } else {
          res.status(404).send(`The lot with ID: ${number} does not exist`);
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

lotsRouter.put(
  '/:id',
  jsonParser,
  errorHandler,
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    let connection: Sequelize | undefined;
    connectDb()
      .then(async sequelize => {
        connection = sequelize;
        const id = parseInt(req.params.id);
        const lot: ILots = req.body;
        if (_.isEmpty(lot)) {
          res
            .status(400)
            .send(
              'at least one filled field is needed to be able to update the entity'
            );
          logger(
            'at least one filled field is needed to be able to update the entity'
          );
        }
        const { error } = validateUpdateLots(req.body);
        if (error !== undefined) {
          console.log(error);
          const { message } = error.details[0];
          res.status(400).send(message);
          next(error);
          return;
        }
        const controller: LotsController = new LotsController();
        const response = await controller.updateLot(id, lot, connection);
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

lotsRouter.delete(
  '/:id',
  errorHandler,
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    let connection: Sequelize | undefined;
    connectDb()
      .then(async sequelize => {
        connection = sequelize;
        const id = parseInt(req.params.id);
        const controller: LotsController = new LotsController();
        const response = await controller.destroyLot(id, connection);
        if (response !== undefined) {
          console.log(response);
          res.status(response.status).send(response.message);
        } else {
          logger('something went wrong in the Controller', 'warn', 'users');
          res.status(500).send('Internal Server Error');
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

lotsRouter.post(
  '/cattle',
  jsonParser,
  errorHandler,
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    let connection: Sequelize | undefined;
    connectDb()
      .then(async sequelize => {
        connection = sequelize;
        const id: number = req.body.id;
        const controller: LotsController = new LotsController();
        const response = await controller.getLotsCattle(id, connection);

        if (response !== null) {
          res.status(200).send(response);
        } else {
          res.status(404).send(`The lot's ID: ${id} does not exist`);
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

export default lotsRouter;
