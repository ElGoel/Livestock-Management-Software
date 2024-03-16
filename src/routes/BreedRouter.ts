import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';

// ? Controller
import { BreedController } from '../controller/BreedController';

// ? Utils Methods
import logger from '../utils/logger';
import {
  validateCreateBreed,
  validateUpdateCattle,
} from '../utils/validations/validateBreed';

// ? Interfaces & Types
import { type IBreed, type DataResponse } from '../interfaces';

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

const breedRouter = express.Router();

/**
 * Breed EndPoint:
 * * http://localhost:5000/api/breed
 */
breedRouter.post(
  '/',
  jsonParser,
  errorHandler,
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    let connection: Sequelize | undefined;
    connectDb()
      .then(async (sequelize: Sequelize | undefined) => {
        connection = sequelize;
        const { error } = validateCreateBreed(req.body);
        if (error !== undefined) {
          console.error(error);
          const { message } = error.details[0];
          res.status(400).send(message);
          next(error);
        } else {
          const controller: BreedController = new BreedController();
          const breedObj = _.pick(req.body, [
            'code',
            'origin',
            'name',
            'production',
            'isEditable',
          ]);
          const response: CreateResult<IBreed> = await controller.createBreed(
            breedObj,
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

breedRouter.get(
  '/',
  errorHandler,
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    let connection: Sequelize | undefined;
    connectDb()
      .then(async sequelize => {
        connection = sequelize;
        const controller: BreedController = new BreedController();
        const response: DataResponse<IBreed> | unknown | undefined =
          await controller.getBreed(connection);
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

breedRouter.get(
  '/:id',
  errorHandler,
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    let connection: Sequelize | undefined;
    connectDb()
      .then(async sequelize => {
        connection = sequelize;
        let query: string | number | undefined;
        if (!isNaN(parseInt(req.params.id))) {
          query = parseInt(req.params.id);
        } else {
          query = req.params.id;
        }
        const controller: BreedController = new BreedController();
        const response = await controller.getBreedById(connection, query);

        if (response !== null) {
          res.status(200).send(response);
        } else {
          res
            .status(404)
            .send(`The breed with ID or Name: ${query} does not exist`);
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

breedRouter.put(
  '/:id',
  jsonParser,
  errorHandler,
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    let connection: Sequelize | undefined;
    connectDb()
      .then(async sequelize => {
        connection = sequelize;
        const id = parseInt(req.params.id);
        const breed: IBreed = {
          origin: req.body.origin,
          name: req.body.name,
          production: req.body.production,
        };
        if (_.isEmpty(breed)) {
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
          console.error(error);
          const { message } = error.details[0];
          res.status(400).send(message);
          next(error);
          return;
        }
        const controller: BreedController = new BreedController();
        const response = await controller.updateBreed(id, breed, connection);
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

breedRouter.delete(
  '/:id',
  errorHandler,
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    let connection: Sequelize | undefined;
    connectDb()
      .then(async sequelize => {
        connection = sequelize;
        const id = parseInt(req.params.id);
        const controller: BreedController = new BreedController();
        const response = await controller.destroyBreed(id, connection);
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

export default breedRouter;
