// ? tsoa
import { Route, Tags, Post, Get, Put, Delete } from 'tsoa';

// ? Interfaces & Types
import { type IBreedController, type BasicResponse } from '../interfaces';
import { type IBreed } from '../interfaces/cattle.interface';
import { type Sequelize } from 'sequelize';
import {
  type CreateResult,
  type CattleResult,
} from '../types/PromiseTypeResponse';

// ? Utils Methods
import logger from '../utils/logger';

// ? ORM Methods C.R.U.D
import {
  createBreed,
  deleteBreedById,
  getAllBreed,
  getBreedByIdOrNumber,
  updateBreedById,
} from '../models/orm/Breed.orm';

@Route('/api/Breed')
@Tags('BreedController')
export class BreedController implements IBreedController<IBreed> {
  @Get('/')
  public async getBreed(
    page: number,
    limit: number,
    connection?: Sequelize
  ): CattleResult<IBreed> {
    logger('[/api/breed] GET All Cattle Request');

    return await getAllBreed(page, limit, connection);
  }

  @Post('/')
  public async createBreed(
    breed: IBreed,
    connection?: Sequelize
  ): Promise<CreateResult<IBreed>> {
    try {
      logger(
        `[/api/breed] Creating a New Breed: ${breed.name} Request`,
        'info',
        'users'
      );
      const response = await createBreed(breed, connection);
      logger(
        `[/api/breed] Breed: ${breed.name} Created successfully`,
        'info',
        'users'
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        logger(
          `[CONTROLLER ERROR]: There is a problem when creating a cattle: ${error.message}`
        );
      }
    }
  }

  @Get('/:id')
  public async getBreedById(
    connection?: Sequelize,
    query?: number | string | undefined
  ): CattleResult<IBreed> {
    if (query !== undefined) {
      logger(
        `[/api/breed/:id] GET breed by ID ${query ?? ''} Request`,
        'info',
        'users'
      );
      return await getBreedByIdOrNumber(connection, query);
    } else {
      logger('[/api/breed/:id] Error getting the Breed', 'error', 'users');
    }
  }

  @Put('/:id')
  public async updateBreed(
    id: number,
    breed: IBreed,
    connection?: Sequelize | undefined
  ): Promise<BasicResponse | undefined> {
    const response: BasicResponse | undefined = {
      message: '',
      status: 0,
    };
    try {
      logger('[/api/cattle] Updating the Breed: Request', 'info', 'users');
      const result = await updateBreedById(id, breed, connection);
      if (result?.breedExist === false) {
        response.status = 400;
        response.message = `The breed provided was not found: ID = ${id}`;
      } else if (result?.breedUpdated === false) {
        response.status = 400;
        response.message = `Unable to update Breed with the ID ${id}`;
      } else {
        response.status = 200;
        response.message = `Breed with the ID ${id} updated successfully`;
      }
    } catch (error) {
      if (error instanceof Error) {
        logger(
          `[CONTROLLER ERROR]: There is a problem when updating a Breed: ${error.message}`
        );
      }
      throw error;
    }
    return response;
  }

  @Delete('/:id')
  public async destroyBreed(
    id: number,
    connection?: Sequelize | undefined
  ): Promise<BasicResponse | undefined> {
    const response: BasicResponse | undefined = {
      message: '',
      status: 0,
    };
    try {
      logger('[/api/breed] Delete the Breed: Request', 'info', 'users');
      const result = await deleteBreedById(id, connection);
      if (result?.breedExist === false) {
        response.status = 400;
        response.message = `The Breed provided was not found: ID = ${id}`;
      } else if (result?.breedDestroy === false) {
        response.status = 400;
        response.message = `Unable to delete Breed with the ID ${id}`;
      } else {
        response.status = 200;
        response.message = `Breed with the ID ${id} was delete successfully`;
      }
    } catch (error) {
      if (error instanceof Error) {
        logger(
          `[CONTROLLER ERROR]: There is a problem when deleting a Breed: ${error.message}`
        );
      }
      throw error;
    }
    return response;
  }
}
