// ? tsoa
import { Route, Tags, Post, Get, Put, Delete } from 'tsoa';

// ? Interfaces & Types
import { type BasicResponse, type ICattleController } from '../interfaces';
import { type ICattle } from '../interfaces/cattle.interface';
import { type Sequelize } from 'sequelize';
import { type CattleResult } from '../types/PromiseTypeResponse';

// ? Utils Methods
import logger from '../utils/logger';

// ? ORM Methods C.R.U.D
import {
  createCattle,
  deleteCattleById,
  getAllCattle,
  getCattleByIdOrNumber,
  updateCattleById,
} from '../models/orm/Cattle.orm';

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
   * @param {number} number // ? the id params to search cattle by Primary Key
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

  /**
   * *This code is a method that updates a cattle object in a database using an ORM called {updateCattleById}.
   * *It takes in the ID of the object to be updated, the updated fields of the object, and an optional connection to the database.
   * *It then checks if the update was successful or not and returns a response object with a message and a status code indicating the outcome.
   * *If there was an error during the update process, the method logs the error and throws it.
   * @method updateCattleById
   * @param {number} id // ? ID of the object to be updated
   * @param {ICattle} cattle // ? updated object
   * @param {Sequelize} [connection] // ? connection to the database
   * @return {Promise<BasicResponse | undefined>} // ? 400 response || 200 response
   * @memberof CattleController
   */
  @Put('/:id')
  public async updateCattle(
    id: number,
    cattle: ICattle,
    connection?: Sequelize
  ): Promise<BasicResponse | undefined> {
    const response: BasicResponse | undefined = {
      message: '',
      status: 0,
    };
    try {
      logger('[/api/cattle] Updating the Cattle: Request', 'info', 'users');
      const result = await updateCattleById(id, cattle, connection);
      if (result?.cattleExist === false) {
        response.status = 400;
        response.message = `The Cattle provided was not found: ID = ${id}`;
      } else if (result?.cattleUpdated === false) {
        response.status = 400;
        response.message = `Unable to update Cattle with the ID ${id}`;
      } else {
        response.status = 200;
        response.message = `Cattle with the ID ${id} updated successfully`;
      }
    } catch (error) {
      if (error instanceof Error) {
        logger(
          `[CONTROLLER ERROR]: There is a problem when updating a cattle: ${error.message}`
        );
      }
      throw error;
    }
    return response;
  }

  /**
   * *This is a Method that uses an ORM called Sequelize to update or delete cattle data from a database.
   * *It takes in an ID, and optionally the updated cattle data or a database connection.
   * *The function checks if the cattle to be updated or deleted exists and returns a response with a status code and message indicating if the operation was successful or not.
   * *It also logs any errors that occur during the process.
   * @method deleteCattleById // ? Method ORM
   * @param {number} id // ? id of the object to be deleted
   * @param {Sequelize} [connection] // ? Connection to the database
   * @return {Promise<BasicResponse | undefined>} // ? 400 response || 200 response
   * @memberof CattleController
   */
  @Delete('/:id')
  public async destroyCattle(
    id: number,
    connection?: Sequelize
  ): Promise<BasicResponse | undefined> {
    const response: BasicResponse | undefined = {
      message: '',
      status: 0,
    };
    try {
      logger('[/api/cattle] Delete the Cattle: Request', 'info', 'users');
      const result = await deleteCattleById(id, connection);
      if (result?.cattleExist === false) {
        response.status = 400;
        response.message = `The Cattle provided was not found: ID = ${id}`;
      } else if (result?.cattleDestroy === false) {
        response.status = 400;
        response.message = `Unable to delete Cattle with the ID ${id}`;
      } else {
        response.status = 200;
        response.message = `Cattle with the ID ${id} was delete successfully`;
      }
    } catch (error) {
      if (error instanceof Error) {
        logger(
          `[CONTROLLER ERROR]: There is a problem when deleting a cattle: ${error.message}`
        );
      }
      throw error;
    }
    return response;
  }
}
