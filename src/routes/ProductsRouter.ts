import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';

// ? Controllers
import { ProductsController } from '../controller/ProductsController';

// ? Utils Methods
import logger from '../utils/logger';
import {
  validateCreateProducts,
  validateUpdateProducts,
} from '../utils/validations/ValidateProducts';

// ? Interfaces & Types
import { type Sequelize } from 'sequelize';
import { type CreateResult } from '../types/PromiseTypeResponse';
import { type DataResponse, type IProducts } from '../interfaces';

// ? Libraries
import _ from 'lodash';
import bodyParser from 'body-parser';

// ? Middlewares
import asyncMiddleware from '../middlewares/async';
import connectDb from '../middlewares/connectDb';
import disconnectDb from '../middlewares/disconnectDb';
import errorHandler from '../middlewares/errorHandler';

// * get json from body;
const jsonParser = bodyParser.json();

const productsRouter = express.Router();

/**
 * Products EndPoint:
 * * http://localhost:5000/api/products
 */
productsRouter.post(
  '/',
  jsonParser,
  errorHandler,
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    let connection: Sequelize | undefined;
    connectDb()
      .then(async (sequelize?: Sequelize) => {
        connection = sequelize;
        const { error } = validateCreateProducts(req.body);
        if (error !== undefined) {
          console.log(error);
          const { message } = error.details[0];
          res.status(400).send(message);
          next(error);
          return;
        }
        const productsObj = _.pick(req.body, [
          'CattleId',
          'totalMilk',
          'notes',
        ]);
        const controller: ProductsController = new ProductsController();
        const response: CreateResult<IProducts> =
          await controller.createProduct(productsObj, connection);
        if (response !== undefined) {
          res.status(response.status).send(response);
        } else {
          res.status(400).send('something went wrong');
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

productsRouter.get(
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
        const controller: ProductsController = new ProductsController();
        const response: DataResponse<IProducts> | unknown | undefined =
          await controller.getProducts(parsePage, parseLimit, connection);
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

productsRouter.get(
  '/:id',
  errorHandler,
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    let connection: Sequelize | undefined;
    connectDb()
      .then(async sequelize => {
        connection = sequelize;
        const number = parseInt(req.params.id);
        const controller: ProductsController = new ProductsController();
        const response = await controller.getProductById(connection, number);

        if (response !== null) {
          res.status(200).send(response);
        } else {
          res.status(404).send(`The Product with ID: ${number} does not exist`);
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

productsRouter.put(
  '/:id',
  jsonParser,
  errorHandler,
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    let connection: Sequelize | undefined;
    connectDb()
      .then(async sequelize => {
        connection = sequelize;
        const id = parseInt(req.params.id);
        const product: IProducts = req.body;
        if (_.isEmpty(product)) {
          res
            .status(400)
            .send(
              'at least one filled field is needed to be able to update the entity'
            );
          logger(
            'at least one filled field is needed to be able to update the entity'
          );
        }
        const { error } = validateUpdateProducts(req.body);
        if (error !== undefined) {
          console.log(error);
          const { message } = error.details[0];
          res.status(400).send(message);
          next(error);
          return;
        }
        const controller: ProductsController = new ProductsController();
        const response = await controller.updateProduct(
          id,
          product,
          connection
        );
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

productsRouter.delete(
  '/:id',
  errorHandler,
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    let connection: Sequelize | undefined;
    connectDb()
      .then(async sequelize => {
        connection = sequelize;
        const id = parseInt(req.params.id);
        const controller: ProductsController = new ProductsController();
        const response = await controller.destroyProduct(id, connection);
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

export default productsRouter;
