import dotenv from 'dotenv';
import logger from '../../utils/logger';
import { type ICattle } from '../../interfaces/cattle.interface';
import { cattleEntity } from '../entities/Cattle.entity';
import { type Sequelize, type Model } from 'sequelize';
import { type DataResponse, type BasicResponse } from '../../interfaces';

dotenv.config();

export /**
 * * ORM Method
 * ? Method who receives a param [cattle] entity and use the CattleModel to create a new entity
 * @param {ICattle} [cattle]
 * @return {Promise<Model<ICattle> | Promise<BasicResponse> | undefined>}
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
      response = { message: 'Cattle already exists' };
    }
    await cattleModel?.create(cattle);
    response = {
      message: `${cattle.register} Just register a Cattle with the number of ${cattle.number}, successfully`,
    };
  } catch (error) {
    if (error instanceof Error) {
      logger(`[ORM ERROR] Creating Cattle:${error.message}`, 'error', 'db');
      response = { message: error.message };
    }
  }
  return response;
};

export const getAllCattle = async (
  page: number,
  limit: number,
  connection?: Sequelize,
  id?: string
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
      logger(`[ORM ERROR] Get All Cattle:${error.message}`, 'error', 'db');
      response.error = error.message;
    }
  }
  return response.cattle.length > 0 ? response : response.error;
};
