// ? tsoa
import { Route, Tags, Post, Get } from 'tsoa';

// ? Interfaces & Types
import { type BasicResponse, type ICattleController } from '../interfaces';
import { type ICattle } from '../interfaces/cattle.interface';
import { type Sequelize } from 'sequelize';

// ? Utils Methods
import logger from '../utils/logger';

// ? ORM Methods C.R.U.D
import {
  createCattle,
  getAllCattle,
  getCattleByIdOrNumber,
} from '../models/orm/Cattle.orm';
import { type CattleResult } from '../types/PromiseTypeResponse';

@Route('/api/cattle')
@Tags('CattleController')
export class CattleController implements ICattleController {
  /**
   * * EndPoint to create a new Cattle Entity into the table "Cattle" of the postgres database
   * @param {ICattle} cattle // ? receives a Validate Cattle object from the body of the POST request
   * @param {Sequelize | undefined} [connection] // ? Instance of the Sequelize Connection
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

  /**
   *
   * * Method to get all the Cattle of the 'Cattle' Table, using the ORM 'getAllCattle'
   * @method getAllCattle // ? ORM
   * @param {number} page // ? Number of the page of the Cattle list
   * @param {number} limit // ? The maximum number of items to return per page
   * @param {Sequelize | undefined} [connection] // ? Instance of the Sequelize Connection
   * @return {CattleResult} // * Promise<DataResponse | Model<ICattle, ICattle> | null | undefined | unknown>
   * @memberof CattleController
   */
  @Get('/')
  public async getCattle(
    page: number,
    limit: number,
    connection?: Sequelize
  ): CattleResult {
    logger('[/api/cattle] GET All Cattle Request');

    return await getAllCattle(page, limit, connection);
  }

  /**
   * * Method to get the Cattle with the primary key from the id params of the 'Cattle' Table, using the ORM 'getCattleById'
   * @method getCattleById // ? ORM method
   * @param {number} id // ? the id params to search cattle by Primary Key
   * @param {Sequelize | undefined} [connection] // ? Instance of the Sequelize Connection
   * @return {CattleResult} // * Promise<DataResponse | Model<ICattle, ICattle> | null | undefined | unknown>
   * @memberof CattleController
   */
  @Get('/:id')
  public async getCattleById(
    number?: number,
    connection?: Sequelize
  ): CattleResult {
    if (number !== undefined) {
      logger(
        `[/api/cattle/:id] GET Cattle by ID ${number} Request`,
        'info',
        'users'
      );
      return await getCattleByIdOrNumber(number, connection);
    } else {
      logger('[/api/cattle/:id] Error getting the Cattle', 'error', 'users');
    }
  }
}
