import dotenv from 'dotenv';
import logger from '../../utils/logger';
import { type ICattle } from '../../interfaces/cattle.interface';
import { cattleEntity } from '../entities/Cattle.entity';
import { type Sequelize, type Model, Op } from 'sequelize';
import { type DataResponse, type BasicResponse } from '../../interfaces';
import { type CattleResult } from '../../types/PromiseTypeResponse';

dotenv.config();

export /**
 * * ORM Method
 * ? Method who receives a param [cattle] entity and use the CattleModel to create a new entity
 * @param {ICattle} [cattle]
 * @return {Promise<BasicResponse | undefined>}
 */
const createCattle = async (
  cattle: ICattle,
  connection?: Sequelize
): Promise<BasicResponse | undefined> => {
  let response: BasicResponse | undefined;
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
      response = {
        message: `${cattle.register} Just register a Cattle with the number of ${cattle.number}, successfully`,
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

export const getAllCattle = async (
  page: number,
  limit: number,
  connection?: Sequelize
): Promise<DataResponse | undefined | unknown> => {
  const response: DataResponse = {
    totalPages: 0,
    currentPage: 0,
    cattle: [],
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
        response.cattle = cattle;
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
  return response.cattle.length > 0 ? response : response.error;
};

export const getCattleByIdOrNumber = async (
  number?: number,
  connection?: Sequelize
): CattleResult => {
  try {
    const cattleModel = await cattleEntity(connection);
    const response = await cattleModel?.findOne({
      where: {
        [Op.or]: [{ id: number }, { number }],
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

export const updateCattleById = async (
  id: number,
  cattle: ICattle,
  connection?: Sequelize
): Promise<{ cattleUpdated: boolean; cattleExist: boolean } | undefined> => {
  try {
    const cattleModel = await cattleEntity(connection);
    const cattleExist = (await cattleModel?.findByPk(id)) !== null;
    console.log(cattleExist);
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
