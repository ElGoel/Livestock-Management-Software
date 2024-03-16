// ? tsoa
import { Route, Tags, Post, Get, Put, Delete } from 'tsoa';

// ? Interfaces & Types
import {
  /* type BasicResponse */ type BasicResponse,
  type ILotsController,
} from '../interfaces';
import { type ILots } from '../interfaces/cattle.interface';
import { type Sequelize } from 'sequelize';
import {
  type CattleResult,
  type CreateResult,
} from '../types/PromiseTypeResponse';

// ? Utils Methods
import logger from '../utils/logger';

// ? ORM Methods C.R.U.D
import {
  createLot,
  deleteLotById,
  getAllLots,
  getAllLotsCattle,
  getLotByIdOrName,
  updateLotById,
} from '../models/orm/Lots.orm';

@Route('/api/lots')
@Tags('LotsController')
export class LotsController implements ILotsController<ILots> {
  @Get('/:id')
  public async getLotById(
    query?: string | number | undefined,
    connection?: Sequelize | undefined
  ): CattleResult<ILots> {
    if (query !== undefined) {
      logger(
        `[/api/lots/:id] GET Lot by ID ${query ?? ''} Request`,
        'info',
        'users'
      );
      return await getLotByIdOrName(query, connection);
    } else {
      logger('[/api/lots/:id] Error getting the Breed', 'error', 'users');
    }
  }

  @Get('/')
  public async getLots(
    page: number,
    limit: number,
    connection?: Sequelize
  ): CattleResult<ILots> {
    logger('[/api/lots] GET All Lots Request');
    return await getAllLots(page, limit, connection);
  }

  @Post('/')
  public async createLot(
    lot: ILots,
    connection: Sequelize | undefined
  ): Promise<CreateResult<ILots>> {
    try {
      logger(
        `[/api/lots] Creating a New Lot: ${lot.name} Request`,
        'info',
        'users'
      );
      const response = await createLot(lot, connection);
      logger(
        `[/api/lots] Lot: ${lot.name} Created successfully`,
        'info',
        'users'
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        logger(
          `[CONTROLLER ERROR]: There is a problem when creating a lot: ${error.message}`
        );
      }
    }
  }

  @Put('/:id')
  public async updateLot(
    id: number,
    lot: ILots,
    connection?: Sequelize | undefined
  ): Promise<BasicResponse | undefined> {
    const response: BasicResponse | undefined = {
      message: '',
      status: 0,
    };
    try {
      logger('[/api/lots] Updating the Lot: Request', 'info', 'users');
      const result = await updateLotById(id, lot, connection);
      if (result?.lotExist === false) {
        response.status = 400;
        response.message = `The Lot provided was not found: ID = ${id}`;
      } else if (result?.lotUpdated === false) {
        response.status = 400;
        response.message = `Unable to update Lot with the ID ${id}`;
      } else {
        response.status = 200;
        response.message = `Lot with the ID ${id} updated successfully`;
      }
    } catch (error) {
      if (error instanceof Error) {
        logger(
          `[CONTROLLER ERROR]: There is a problem when updating a lot: ${error.message}`
        );
      }
      throw error;
    }
    return response;
  }

  @Delete('/:id')
  public async destroyLot(
    id: number,
    connection?: Sequelize | undefined
  ): Promise<BasicResponse | undefined> {
    const response: BasicResponse | undefined = {
      message: '',
      status: 0,
    };
    try {
      logger('[/api/lots] Delete the Lot: Request', 'info', 'users');
      const result = await deleteLotById(id, connection);
      if (result?.lotExist === false) {
        response.status = 400;
        response.message = `The Lot provided was not found: ID = ${id}`;
      } else if (result?.lotToEliminate === false) {
        response.status = 400;
        response.message = `Unable to delete Lots with the ID ${id}`;
      } else {
        response.status = 200;
        response.message = `Lots with the ID ${id} was delete successfully`;
      }
    } catch (error) {
      if (error instanceof Error) {
        logger(
          `[CONTROLLER ERROR]: There is a problem when deleting a Lot: ${error.message}`
        );
      }
      throw error;
    }
    return response;
  }

  @Get('/cattle')
  public async getLotsCattle(
    id?: number | undefined,
    connection?: Sequelize | undefined
  ): CattleResult<ILots> {
    if (id !== undefined) {
      logger(
        `[/api/lots/cattle] GET Lot by ID ${id ?? ''} Request`,
        'info',
        'users'
      );
      return await getAllLotsCattle(id, connection);
    } else {
      logger(
        '[/api/lots/cattle] Error getting all the Cattle',
        'error',
        'users'
      );
    }
  }
}
