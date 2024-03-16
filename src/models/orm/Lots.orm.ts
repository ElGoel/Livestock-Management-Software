// ? Libraries and Packages
import dotenv from 'dotenv';

// ? Utils Functions
import logger from '../../utils/logger';

// ? Sequelize Model
import { lotsEntity } from '../entities/Lots.entity';

// ? Types and Interfaces
import { type ICattle, type ILots } from '../../interfaces/cattle.interface';
import { Op, type Model, type Sequelize } from 'sequelize';
import {
  type CattleResult,
  type CreateResult,
} from '../../types/PromiseTypeResponse';
import { type RelationsResponse, type DataResponse } from '../../interfaces';
import { cattleEntity } from '../entities/Cattle.entity';

dotenv.config();

export /**
 * * ORM Method
 * * Method who receives a param [lots] entity and use the lotsModel to create a new entity
 * @param {Sequelize} [connection] // ? Connection to the database
 * @param {ILots} [lots] // ? lots Object
 * @return {Promise<BasicResponse | undefined>} status 201 response | status 400 response
 */
const createLot = async (
  lots: ILots,
  connection?: Sequelize
): Promise<CreateResult<ILots>> => {
  let response: CreateResult<ILots>;
  try {
    const lotsModel = await lotsEntity(connection);
    const lotsExist = await lotsModel?.findByPk(lots.id);
    if (lotsExist !== null) {
      response = { message: 'Product already exists', status: 400 };
    } else {
      await lotsModel?.create(lots);
      const lotsFind = await lotsModel?.findOne({
        where: {
          name: lots?.name,
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      });
      response = {
        message: `the lot ${lots.name} as just ben created successfully`,
        item: lotsFind,
        status: 201,
      };
    }
  } catch (error) {
    if (error instanceof Error) {
      logger(`[ORM ERROR] Creating Lots:${error.message}`, 'error', 'users');
      response = { message: error.message, status: 400 };
    }
  }
  return response;
};

export /**
 * * ORM Method
 * * Method who receives [page] & [limit] to return an DataResponse
 * * with the [totalPage, currentPage] and the lots list
 * @param {number} page // ? Page of the of the [lots] list
 * @param {number} limit // ? Limit of items of the [lots] list
 * @param {Sequelize} [connection] // ? Connection to the database
 * @return {Promise<DataResponse | undefined | unknown>}
 */
const getAllLots = async (
  page: number,
  limit: number,
  connection?: Sequelize
): Promise<DataResponse<ILots> | undefined | unknown> => {
  const response: DataResponse<ILots> = {
    totalPages: 0,
    currentPage: 0,
    item: [],
  };
  try {
    const offset = limit * (page - 1);
    const lotsModel = await lotsEntity(connection);
    await lotsModel
      ?.findAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
        limit,
        offset,
      })
      .then((lots: Array<Model<ILots, ILots>>) => {
        response.item = lots;
      });
    await lotsModel?.count().then((total: number) => {
      response.totalPages = Math.ceil(total / limit);
      response.currentPage = page;
    });
  } catch (error) {
    if (error instanceof Error) {
      logger(`[ORM ERROR] Get All lots:${error.message}`, 'error', 'users');
      response.error = error.message;
    }
  }
  return response.item.length > 0 ? response : response.error;
};

export /**
 * * ORM Method:
 * * Method who receives a [number] that can be the ID or the Number of the lots Entity
 * * It will return a lots entity with the id | number
 * @param {number} [number] // ? the ID | Number of the [lots] to retrieve
 * @param {Sequelize} [connection] // ? Connection to the database
 * @return {CattleResult} // ? DataResponse | Model<ILots, ILots> | null | undefined | unknown
 */
const getLotByIdOrName = async (
  query?: number | string | undefined,
  connection?: Sequelize
): CattleResult<ILots> => {
  try {
    const lotsModel = await lotsEntity(connection);
    const response = await lotsModel?.findOne({
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
      logger(
        `[ORM ERROR] Get lot By ID or Name: ${error.message}`,
        'error',
        'users'
      );
    }
  }
};

export /**
 ** ORM Method:
 ** Method who receives a param [lot] object and use the lotsModel to update an entity
 * @param {number} id // ? The id of the lot entity
 * @param {ILots} lot // ? Lot Object
 * @param {Sequelize} [connection] // ? Connection to the database
 * @return {Promise<{ lotUpdated: boolean; lotExist: boolean } | undefined>}
 */
const updateLotById = async (
  id: number,
  lot: ILots,
  connection?: Sequelize
): Promise<{ lotUpdated: boolean; lotExist: boolean } | undefined> => {
  try {
    const lotsModel = await lotsEntity(connection);
    const lotExist = (await lotsModel?.findByPk(id)) !== null;
    const lotUpdated =
      (await lotsModel?.update(lot, {
        where: {
          id,
        },
      })) !== undefined;
    return { lotUpdated, lotExist };
  } catch (error) {
    if (error instanceof Error) {
      logger(
        `[ORM ERROR] Error Updating Lot:${error.message}`,
        'error',
        'users'
      );
      throw error;
    }
  }
};

export /**
 * * ORM Method:
 * * Method who receives the param [lotId] id of the lot entity from the 'lots' table.
 * @param {number} lotId // ? The id of the lots entity
 * @param {Sequelize} [connection] // ? Connection to the database
 * @return {Promise<{ lotToEliminate: boolean; lotExist: boolean } | undefined>}
 */
const deleteLotById = async (
  lotId: number,
  connection?: Sequelize
): Promise<{ lotToEliminate: boolean; lotExist: boolean } | undefined> => {
  try {
    const lotsModel = await lotsEntity(connection);
    const lotItem = await lotsModel?.findOne({ where: { id: lotId } });
    const lotExist = lotItem !== null && lotItem !== undefined;
    let lotToEliminate = false;
    if (lotExist && 'isDelete' in lotItem) {
      lotItem.isDelete = true;
      await lotItem.save();
      lotToEliminate = true;
    }
    return { lotExist, lotToEliminate };
  } catch (error) {
    if (error instanceof Error) {
      logger(
        `[ORM ERROR] Error Updating Lot:${error.message}`,
        'error',
        'users'
      );
      throw error;
    }
  }
};

export /**
 * * ORM Method:
 * * Method who receives an [id]
 * * It will return the lots cattle's entity with the id
 * @param {number} [number] // ? the ID of the [lots] to retrieve
 * @param {Sequelize} [connection] // ? Connection to the database
 * @return {CattleResult} // ? DataResponse | Array<ModelType<ICattle>> | null | undefined | unknown
 */
const getAllLotsCattle = async (
  query?: number | string | undefined,
  connection?: Sequelize
): Promise<RelationsResponse<ICattle> | unknown> => {
  const response: RelationsResponse<ICattle> = {
    id: 0,
    name: null,
    register: null,
    data: [],
  };
  try {
    const lotsModel = await lotsEntity(connection);
    const cattleModel = await cattleEntity(connection);
    const lotsData = await lotsModel?.findOne({
      where: {
        id: query,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });
    const cattleData = await cattleModel?.findAll({
      where: { LotId: query },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });
    response.id = lotsData?.dataValues.id ?? 0;
    response.name = lotsData?.dataValues.name ?? null;
    response.data = cattleData ?? [];

    return response;
  } catch (error) {
    if (error instanceof Error) {
      logger(`[ORM ERROR] Get All lots:${error.message}`, 'error', 'users');
      response.error = error.message;
    }
  }
  return response.data.length > 0 ? response : response.error;
};
