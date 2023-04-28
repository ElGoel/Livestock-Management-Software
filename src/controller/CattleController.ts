// ? tsoa
import { Route, Tags, Post } from 'tsoa';

// ? Interfaces & Types
import { type BasicResponse, type ICattleController } from '../interfaces';
import { type ICattle } from '../interfaces/cattle.interface';

// ? Utils Methods
import logger from '../utils/logger';

// ? ORM Methods C.R.U.D
import { createCattle } from '../models/orm/Cattle.orm';
import { type Model } from 'sequelize';

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
    cattle: ICattle
  ): Promise<BasicResponse | Model<ICattle> | undefined> {
    let response: BasicResponse | Model<ICattle> | undefined;

    try {
      if (cattle !== undefined) {
        logger(
          `[/api/cattle] Creating New Cattle: ${cattle.number} Request`,
          'info',
          'users'
        );
        response = await createCattle(cattle);
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
}
