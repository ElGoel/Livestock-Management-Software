// ? tsoa
import { Route, Tags, Post } from 'tsoa';

// ? Interfaces & Types
import {
  type DataResponse,
  type BasicResponse,
  type ICattleController,
} from '../interfaces';
import { type ICattle } from '../interfaces/cattle.interface';
import { type Sequelize } from 'sequelize';

// ? Utils Methods
import logger from '../utils/logger';

// ? ORM Methods C.R.U.D
import { createCattle, getAllCattle } from '../models/orm/Cattle.orm';

@Route('/api/cattle')
@Tags('KatasController')
export class CattleController implements ICattleController {
  /**
   * * EndPoint to create a new Cattle Entity into the table "Cattle" of the postgres database
   * @param {ICattle} cattle // ? receives a Validate Cattle object from the body of the POST request
   * @return {BasicResponse | Model<ICattle>}
   * @memberof CattleController
   */
  @Post('/')
  public async createCattle(
    cattle: ICattle,
    connection?: Sequelize
  ): Promise<BasicResponse | undefined> {
    let response: BasicResponse | undefined;

    try {
      if (cattle !== undefined) {
        logger(
          `[/api/cattle] Creating New Cattle: ${cattle.number} Request`,
          'info',
          'users'
        );
        response = await createCattle(cattle, connection);
        logger(
          `[/api/cattle] Cattle: ${cattle.number} Created successfully`,
          'info',
          'users'
        );
      } else {
        logger('[/api/cattle] Register needs cattle Entity', 'warn', 'users');
      }
    } catch (error) {
      if (error instanceof Error) {
        logger(
          `[CONTROLLER ERROR]: There is a problem when creating a cattle: ${error.message}`
        );
      }
    }
    return response;
  }

  public async getCattle(
    page: number,
    limit: number,
    connection?: Sequelize,
    id?: string
  ): Promise<DataResponse | unknown | undefined> {
    let response: DataResponse | undefined | unknown;

    if (id !== undefined) {
      logger(`[/api/cattle] GET Kata by ID ${id} Request`, 'info', 'users');
      // TODO: get cattle from ID request
    } else {
      logger('[/api/cattle] GET All Cattle Request');
      response = await getAllCattle(page, limit, connection);
    }

    return response;
  }
}
