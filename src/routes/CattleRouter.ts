import express, { type Request, type Response } from 'express';

// ? Controllers
import { CattleController } from '../controller/CattleController';

// ? Utils Methods
import logger from '../utils/logger';
import { validateCattle } from '../utils/validateCattle';

// ? Interfaces & Types
import { type ICattle } from '../interfaces/cattle.interface';
import { type BasicResponse } from '../interfaces';
import { type Model } from 'sequelize';

// ? Libraries
import _ from 'lodash';
import bodyParser from 'body-parser';

// ? Middlewares
import asyncMiddleware from '../middlewares/async';
import { connectDb, disconnectDb } from '../middlewares/db';

// * get json from body;
const jsonParser = bodyParser.json();

const cattleRouter = express.Router();

/**
 * Cattle EndPoint:
 * * http://localhost:5000/api/cattle
 */
cattleRouter.route('/').post(
  jsonParser,
  asyncMiddleware(async (req: Request, res: Response) => {
    const { error } = validateCattle(req.body);
    if (error !== undefined) {
      console.log(error);
      return res.status(400).send(error);
    }
    connectDb()
      .then(async () => {
        const cattleObj = _.pick(req.body, [
          'number',
          'race',
          'initWeight',
          'quarterlyWeight',
          'register',
        ]);
        const controller: CattleController = new CattleController();
        const cattle: ICattle = cattleObj;
        const response: BasicResponse | Model<ICattle, ICattle> | undefined =
          await controller.createCattle(cattle);
        await disconnectDb();
        return res.status(201).send(response);
      })
      .catch(error => {
        if (error instanceof Error) {
          logger(`[CONNECTION ERROR]:${error.message}`, 'error', 'db');
        }
      });
  })
);

export default cattleRouter;
