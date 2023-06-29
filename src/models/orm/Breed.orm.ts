// ? Libraries and Packages
import dotenv from 'dotenv';

// ? Utils Functions
import logger from '../../utils/logger';

// ? Sequelize Model
import { breedEntity } from '../entities/Breed.entity';

// ? Types and Interfaces
import { type IBreed } from '../../interfaces/cattle.interface';
import { type Sequelize, type Model, Op } from 'sequelize';
import { type DataResponse } from '../../interfaces';
import {
  type CreateResult,
  type CattleResult,
} from '../../types/PromiseTypeResponse';

dotenv.config();

export /**
 * * ORM Method
 * * Method who receives a param [breed] entity and use the breedModel to create a new entity
 * @param {Sequelize} [connection] // ? Connection to the database
 * @param {IBreed} [breed] // ? breed Object
 * @return {Promise<BasicResponse | undefined>} status 201 response | status 400 response
 */
const createBreed = async (
  breed: IBreed,
  connection?: Sequelize
): Promise<CreateResult> => {
  let response: CreateResult;
  try {
    const breedModel = await breedEntity(connection);
    const breedExist = await breedModel?.findOne({
      where: {
        name: breed?.name,
      },
    });
    if (breedExist !== null) {
      response = { message: 'Breed already exists', status: 400 };
    } else {
      await breedModel?.create(breed);
      const breedFind = await breedModel?.findOne({
        where: {
          name: breed?.name,
        },
        attributes: {
          exclude: ['ísEditable', 'createdAt', 'updatedAt'],
        },
      });
      response = {
        message: `${breed.name} as just ben created successfully`,
        item: breedFind,
        status: 201,
      };
    }
  } catch (error) {
    if (error instanceof Error) {
      logger(`[ORM ERROR] Creating Breed:${error.message}`, 'error', 'users');
      response = { message: error.message, status: 400 };
    }
  }
  return response;
};

export /**
 * * ORM Method
 * * Method who receives [page] & [limit] to return an DataResponse
 * * with the [totalPage, currentPage] and the breed list
 * @param {number} page // ? Page of the of the [breed] list
 * @param {number} limit // ? Limit of items of the [breed] list
 * @param {Sequelize} [connection] // ? Connection to the database
 * @return {Promise<DataResponse | undefined | unknown>}
 */
const getAllBreed = async (
  page: number,
  limit: number,
  connection?: Sequelize
): Promise<DataResponse | undefined | unknown> => {
  const response: DataResponse = {
    totalPages: 0,
    currentPage: 0,
    data: [],
  };
  try {
    const offset = limit * (page - 1);
    const breedModel = await breedEntity(connection);
    await breedModel
      ?.findAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
        limit,
        offset,
      })
      .then((breed: Array<Model<IBreed, IBreed>>) => {
        response.data = breed;
      });
    await breedModel?.count().then((total: number) => {
      response.totalPages = Math.ceil(total / limit);
      response.currentPage = page;
    });
  } catch (error) {
    if (error instanceof Error) {
      logger(`[ORM ERROR] Get All breed:${error.message}`, 'error', 'users');
      response.error = error.message;
    }
  }
  return response.data.length > 0 ? response : response.error;
};

export /**
 * * ORM Method:
 * * Method who receives a [number] that can be the ID or the Number of the breed Entity
 * * It will return a breed entity with the id | number
 * @param {number} [number] // ? the ID | Number of the [breed] to retrieve
 * @param {Sequelize} [connection] // ? Connection to the database
 * @return {breedResult} // ? DataResponse | Model<IBreed, IBreed> | null | undefined | unknown
 */
const getBreedByIdOrNumber = async (
  query?: number | string | undefined,
  connection?: Sequelize
): CattleResult => {
  console.log('NUMERO QUERY:', typeof query);
  try {
    const breedModel = await breedEntity(connection);
    const response = await breedModel?.findOne({
      where: {
        [Op.or]: [typeof query === 'number' ? { id: query } : { name: query }],
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });
    return response;
  } catch (error) {
    if (error instanceof Error) {
      logger(`[ORM ERROR] Get breed By ID: ${error.message}`, 'error', 'users');
    }
  }
};

export /**
 ** ORM Method:
 ** Method who receives a param [breed] object and use the breedModel to update an entity
 * @param {number} id // ? The id of the breed entity
 * @param {IBreed} breed // ? breed Object
 * @param {Sequelize} [connection] // ? Connection to the database
 * @return {Promise<{ breedUpdated: boolean; breedExist: boolean } | undefined>}
 */
const updateBreedById = async (
  id: number,
  breed: IBreed,
  connection?: Sequelize
): Promise<{ breedUpdated: boolean; breedExist: boolean } | undefined> => {
  try {
    const breedModel = await breedEntity(connection);
    const breedItem = await breedModel?.findByPk(id);
    const breedExist = breedItem !== null && breedItem !== undefined;
    let breedUpdated = false;
    if (breedExist && 'isEditable' in breedItem) {
      if (breedItem.isEditable === true) {
        await breedModel?.update(breed, {
          where: {
            id,
          },
        });
        breedUpdated = true;
      } else {
        throw new Error('The specified breed does not exist or can be edited');
      }
    }
    return { breedUpdated, breedExist };
  } catch (error) {
    if (error instanceof Error) {
      logger(
        `[ORM ERROR] Error Updating breed:${error.message}`,
        'error',
        'users'
      );
      throw error;
    }
  }
};

export /**
 * * ORM Method:
 * * Method who receives the param [breedId] id of the breed entity from the 'breed' table.
 * @param {number} breedId // ? The id of the breed entity
 * @param {Sequelize} [connection] // ? Connection to the database
 * @return {Promise<{ breedDestroy: boolean; breedExist: boolean } | undefined>}
 */
const deleteBreedById = async (
  breedId: number,
  connection?: Sequelize
): Promise<{ breedDestroy: boolean; breedExist: boolean } | undefined> => {
  try {
    const breedModel = await breedEntity(connection);
    const breedItem = await breedModel?.findByPk(breedId);
    const breedExist = breedItem !== null && breedItem !== undefined;
    let breedDestroy = false;
    if (breedExist && 'isDelete' in breedItem && 'isEditable' in breedItem) {
      if (breedItem.isEditable === true) {
        breedItem.isDelete = true;
        await breedItem.save();
        breedDestroy = true;
      } else {
        throw new Error('The specified breed does not exist or can be deleted');
      }
    }
    return { breedExist, breedDestroy };
  } catch (error) {
    if (error instanceof Error) {
      logger(
        `[ORM ERROR] Error Updating breed:${error.message}`,
        'error',
        'users'
      );
      throw error;
    }
  }
};
