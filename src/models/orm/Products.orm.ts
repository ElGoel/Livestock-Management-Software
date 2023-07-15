// ? Libraries and Packages
import dotenv from 'dotenv';

// ? Utils Functions
import logger from '../../utils/logger';

// ? Types and Interfaces

import { type Sequelize } from 'sequelize';
import { type IProducts, type DataResponse } from '../../interfaces';
import {
  type CattleResult,
  type CreateResult,
} from '../../types/PromiseTypeResponse';
import { type ModelType } from '../../types/dataTypes';
import { productsEntity } from '../entities/Products.entity';
import { cattleEntity } from '../entities/Cattle.entity';

dotenv.config();

export /**
 * * ORM Method
 * * Method who receives a param [items] entity and use the [itemsModel] to create a new entity
 * @param {Sequelize} [connection] // ? Connection to the database
 * @param {IProducts | ICattle | ILots | IBreed} [products] // ? products Object
 * @return {Promise<CreateResult>} status 201 response | status 400 response
 */
const createProduct = async (
  product: IProducts,
  connection?: Sequelize
): Promise<CreateResult<IProducts>> => {
  let response: CreateResult<IProducts>;
  try {
    const productsModel = await productsEntity(connection);
    const cattleModel = await cattleEntity(connection);
    const cow = await cattleModel?.findByPk(product.CattleId);

    if (cow == null) {
      response = {
        message: 'Cow with the provided ID was not found.',
        status: 404,
      };
      throw new Error('Cow with the provided ID was not found.');
    }

    if (cow.dataValues.ageGroup === 'Toro') {
      response = {
        message:
          'Cannot create a product with a cow ID that belongs to a bull.',
        status: 400,
      };
      throw new Error(
        'Cannot create a product with a cow ID that belongs to a bull.'
      );
    }

    const productExist = await productsModel?.findByPk(product.id);
    if (productExist !== null) {
      response = { message: 'The Product already exists', status: 400 };
    } else {
      await productsModel?.create(product);
      const productFound = await productsModel?.findOne({
        where: {
          CattleId: product.CattleId,
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      });
      if (productFound !== undefined && productFound !== null) {
        response = {
          message: `the Product ${
            productFound.dataValues.id ?? 'products'
          } as just ben created successfully`,
          item: productFound,
          status: 201,
        };
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      logger(
        `[ORM ERROR] Creating ${product.CattleId ?? 'products'} :${
          error.message
        }`,
        'error',
        'users'
      );
      response = { message: error.message, status: 400 };
    }
  }
  return response;
};

export /**
 * * ORM Method
 * * Method who receives [page] & [limit] to return an DataResponse
 * * with the [totalPage, currentPage] and the [products] list
 * @param {number} page // ? Page of the of the [products] list
 * @param {number} limit // ? Limit of items of the [products] list
 * @param {Sequelize} [connection] // ? Connection to the database
 * @return {Promise<DataResponse | undefined | unknown>}
 */
const getAllProducts = async (
  page: number,
  limit: number,
  connection?: Sequelize
): Promise<DataResponse<IProducts> | undefined | unknown> => {
  const response: DataResponse<IProducts> = {
    totalPages: 0,
    currentPage: 0,
    item: [],
  };
  try {
    const offset = limit * (page - 1);
    const productsModel = await productsEntity(connection);
    await productsModel
      ?.findAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
        limit,
        offset,
      })
      .then((ModelData: Array<ModelType<IProducts>>) => {
        response.item = ModelData;
      });
    await productsModel?.count().then((total: number) => {
      response.totalPages = Math.ceil(total / limit);
      response.currentPage = page;
    });
  } catch (error) {
    if (error instanceof Error) {
      logger(`[ORM ERROR] Get All Products:${error.message}`, 'error', 'users');
      response.error = error.message;
    }
  }
  return response.item.length > 0 ? response : response.error;
};

export /**
 * * ORM Method:
 * * Method who receives a [number] that can be the ID of the products Entity
 * * It will return a product entity with the id | number
 * @param {number} [number] // ? the ID of the [product] to retrieve
 * @param {Sequelize} [connection] // ? Connection to the database
 * @return {breedResult} // ? DataResponse | Model<IProducts, IProducts> | null | undefined | unknown
 */
const getProductById = async (
  query?: number | string | undefined,
  connection?: Sequelize
): CattleResult<IProducts> => {
  try {
    const productsModel = await productsEntity(connection);
    const response = await productsModel?.findOne({
      where: {
        id: query,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });
    return response;
  } catch (error) {
    if (error instanceof Error) {
      logger(
        `[ORM ERROR] Getting the product By ID: ${error.message}`,
        'error',
        'users'
      );
    }
  }
};

export /**
 ** ORM Method:
 ** Method who receives a param [product] object and use the productModel to update an entity
 * @param {number} id // ? The id of the product entity
 * @param {IProducts} product // ? product Object
 * @param {Sequelize} [connection] // ? Connection to the database
 * @return {Promise<{ productUpdated: boolean; productExist: boolean } | undefined>}
 */
const updateProductById = async (
  id: number,
  product: IProducts,
  connection?: Sequelize
): Promise<{ productUpdated: boolean; productExist: boolean } | undefined> => {
  try {
    const productModel = await productsEntity(connection);
    const productExist = (await productModel?.findByPk(id)) !== null;
    const productUpdated =
      (await productModel?.update(product, {
        where: {
          id,
        },
      })) !== undefined;
    return { productUpdated, productExist };
  } catch (error) {
    if (error instanceof Error) {
      logger(
        `[ORM ERROR] Error Updating Product:${error.message}`,
        'error',
        'users'
      );
      throw error;
    }
  }
};

export /**
 * * ORM Method:
 * * Method who receives the param [productsId] id of the products entity from the 'products' table.
 * @param {number} productsId // ? The id of the products entity
 * @param {Sequelize} [connection] // ? Connection to the database
 * @return {Promise<{ productToEliminate: boolean; productExist: boolean } | undefined>}
 */
const deleteProductById = async (
  productsId: number,
  connection?: Sequelize
): Promise<
  { productToEliminate: boolean; productExist: boolean } | undefined
> => {
  try {
    const productModel = await productsEntity(connection);
    const productItem = await productModel?.findOne({
      where: { id: productsId },
    });
    const productExist = productItem !== null && productItem !== undefined;
    let productToEliminate = false;
    if (productExist && 'isDelete' in productItem) {
      productItem.isDelete = true;
      await productItem.save();
      productToEliminate = true;
    }
    return { productExist, productToEliminate };
  } catch (error) {
    if (error instanceof Error) {
      logger(
        `[ORM ERROR] Error Updating Products:${error.message}`,
        'error',
        'users'
      );
      throw error;
    }
  }
};
