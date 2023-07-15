// ? Libraries and Packages
import dotenv from 'dotenv';

// ? Utils Functions
import logger from '../../utils/logger';

// ? Sequelize Model
import { cattleEntity } from '../entities/Cattle.entity';

// ? Types and Interfaces
import { type ICattle } from '../../interfaces/cattle.interface';
import { type Sequelize, type Model, Op } from 'sequelize';
import { type DataResponse } from '../../interfaces';
import {
  type CreateResult,
  type CattleResult,
} from '../../types/PromiseTypeResponse';

dotenv.config();

export /**
 * * ORM Method
 * * Method who receives a param [cattle] entity and use the CattleModel to create a new entity
 * @param {Sequelize} [connection] // ? Connection to the database
 * @param {ICattle} [cattle] // ? Cattle Object
 * @return {Promise<BasicResponse | undefined>} status 201 response | status 400 response
 */
const createCattle = async (
  cattle: ICattle,
  connection?: Sequelize
): Promise<CreateResult<ICattle>> => {
  let response: CreateResult<ICattle>;
  try {
    const cattleModel = await cattleEntity(connection);
    const cattleExist = await cattleModel?.findOne({
      where: {
        number: cattle?.number,
      },
    });
    if (cattleExist !== null) {
      response = { message: 'Cattle already exists', status: 400 };
    } else {
      await cattleModel?.create(cattle);
      const cattleFind = await cattleModel?.findOne({
        where: {
          number: cattle?.number,
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      });
      response = {
        message: `${cattle.register} Just register a Cattle with the number of ${cattle.number}, successfully`,
        item: cattleFind,
        status: 201,
      };
    }
  } catch (error) {
    if (error instanceof Error) {
      logger(`[ORM ERROR] Creating Cattle:${error.message}`, 'error', 'users');
      response = { message: error.message, status: 400 };
    }
  }
  return response;
};

export /**
 * * ORM Method
 * * Method who receives [page] & [limit] to return an DataResponse
 * * with the [totalPage, currentPage] and the Cattle list
 * @param {number} page // ? Page of the of the [cattle] list
 * @param {number} limit // ? Limit of items of the [cattle] list
 * @param {Sequelize} [connection] // ? Connection to the database
 * @return {Promise<DataResponse | undefined | unknown>}
 */
const getAllCattle = async (
  page: number,
  limit: number,
  connection?: Sequelize
): Promise<DataResponse<ICattle> | undefined | unknown> => {
  const response: DataResponse<ICattle> = {
    totalPages: 0,
    currentPage: 0,
    item: [],
  };
  try {
    const offset = limit * (page - 1);
    const cattleModel = await cattleEntity(connection);
    await cattleModel
      ?.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        limit,
        offset,
      })
      .then((cattle: Array<Model<ICattle, ICattle>>) => {
        response.item = cattle;
      });
    await cattleModel?.count().then((total: number) => {
      response.totalPages = Math.ceil(total / limit);
      response.currentPage = page;
    });
  } catch (error) {
    if (error instanceof Error) {
      logger(`[ORM ERROR] Get All Cattle:${error.message}`, 'error', 'users');
      response.error = error.message;
    }
  }
  return response.item.length > 0 ? response : response.error;
};

export /**
 * * ORM Method:
 * * Method who receives a [number] that can be the ID or the Number of the Cattle Entity
 * * It will return a cattle entity with the id | number
 * @param {number} [number] // ? the ID | Number of the [Cattle] to retrieve
 * @param {Sequelize} [connection] // ? Connection to the database
 * @return {CattleResult} // ? DataResponse | Model<ICattle, ICattle> | null | undefined | unknown
 */
const getCattleByIdOrNumber = async (
  number?: number,
  connection?: Sequelize
): CattleResult<ICattle> => {
  try {
    const cattleModel = await cattleEntity(connection);
    const response = await cattleModel?.findOne({
      where: {
        [Op.or]: [{ id: number }, { number }, { BreedId: number }],
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });
    return response;
  } catch (error) {
    if (error instanceof Error) {
      logger(
        `[ORM ERROR] Get Cattle By ID: ${error.message}`,
        'error',
        'users'
      );
    }
  }
};

export /**
 ** ORM Method:
 ** Method who receives a param [cattle] object and use the CattleModel to update an entity
 * @param {number} id // ? The id of the cattle entity
 * @param {ICattle} cattle // ? Cattle Object
 * @param {Sequelize} [connection] // ? Connection to the database
 * @return {Promise<{ cattleUpdated: boolean; cattleExist: boolean } | undefined>}
 */
const updateCattleById = async (
  id: number,
  cattle: ICattle,
  connection?: Sequelize
): Promise<{ cattleUpdated: boolean; cattleExist: boolean } | undefined> => {
  try {
    const cattleModel = await cattleEntity(connection);
    const cattleExist = (await cattleModel?.findByPk(id)) !== null;
    const cattleUpdated =
      (await cattleModel?.update(cattle, {
        where: {
          id,
        },
      })) !== undefined;
    return { cattleUpdated, cattleExist };
  } catch (error) {
    if (error instanceof Error) {
      logger(
        `[ORM ERROR] Error Updating Cattle:${error.message}`,
        'error',
        'users'
      );
      throw error;
    }
  }
};

export /**
 * * ORM Method:
 * * Method who receives the param [cattleId] id of the cattle entity from the 'Cattle' table.
 * @param {number} cattleId // ? The id of the cattle entity
 * @param {Sequelize} [connection] // ? Connection to the database
 * @return {Promise<{ cattleDestroy: boolean; cattleExist: boolean } | undefined>}
 */
const deleteCattleById = async (
  cattleId: number,
  connection?: Sequelize
): Promise<
  { cattleToEliminate: boolean; cattleExist: boolean } | undefined
> => {
  try {
    const cattleModel = await cattleEntity(connection);
    const cattleItem = await cattleModel?.findOne({ where: { id: cattleId } });
    const cattleExist = cattleItem !== null && cattleItem !== undefined;
    let cattleToEliminate = false;
    if (cattleExist && 'isDelete' in cattleItem) {
      cattleItem.isDelete = true;
      await cattleItem.save();
      cattleToEliminate = true;
    }
    return { cattleExist, cattleToEliminate };
  } catch (error) {
    if (error instanceof Error) {
      logger(
        `[ORM ERROR] Error Updating Cattle:${error.message}`,
        'error',
        'users'
      );
      throw error;
    }
  }
};
