// ? tsoa
import { Post, Route, Tags, Get, Put, Delete } from 'tsoa';

// ? Interfaces & Types
import { type IProductsController, type BasicResponse } from '../interfaces';
import { type IProducts } from '../interfaces/cattle.interface';
import { type Sequelize } from 'sequelize';
import { type CattleResult } from '../types/PromiseTypeResponse';

// ? Utils Methods
import logger from '../utils/logger';
import {
  createProduct,
  deleteProductById,
  getAllProducts,
  getProductById,
  updateProductById,
} from '../models/orm/Products.orm';

@Route('/api/products')
@Tags('BreedController')
export class ProductsController implements IProductsController<IProducts> {
  @Get('/')
  public async getProducts(
    page: number,
    limit: number,
    connection?: Sequelize
  ): CattleResult<IProducts> {
    logger('[/api/products] GET All Cattle Request');
    return await getAllProducts(page, limit, connection);
  }

  @Post('/')
  public async createProduct(
    product: IProducts,
    connection?: Sequelize
  ): Promise<BasicResponse | undefined> {
    try {
      logger(
        `[/api/products] Creating New Product: ${
          product.CattleId ?? ''
        } Request`,
        'info',
        'users'
      );
      const response = await createProduct(product, connection);
      if (response?.status !== 400 && response?.status !== 404) {
        logger(
          `[/api/products] Product: ${
            product.CattleId ?? ''
          } Created successfully`,
          'info',
          'users'
        );
      } else {
        logger('[/api/products] Error creating Product', 'error', 'users');
      }
      return response;
    } catch (error) {
      if (error instanceof Error) {
        logger(
          `[CONTROLLER ERROR]: There is a problem when creating a Product: ${error.message}`
        );
      }
    }
  }

  @Get('/:id')
  public async getProductById(
    connection?: Sequelize,
    query?: string | number | undefined
  ): CattleResult<IProducts> {
    if (query !== undefined) {
      logger(
        `[/api/products/${query ?? ':id'}] GET Cattle by ID ${
          query ?? ''
        } Request`,
        'info',
        'users'
      );
      return await getProductById(query, connection);
    } else {
      logger(
        `[/api/products/${query ?? ':id'}] Error getting the Product`,
        'error',
        'users'
      );
    }
  }

  @Put('/:id')
  public async updateProduct(
    id: number,
    product: IProducts,
    connection?: Sequelize
  ): Promise<
    // ? Interfaces & Types
    BasicResponse | undefined
  > {
    const response: BasicResponse | undefined = {
      message: '',
      status: 0,
    };
    try {
      logger('[/api/products] Updating the product: Request', 'info', 'users');
      const result = await updateProductById(id, product, connection);
      if (result?.productExist === false) {
        response.status = 400;
        response.message = `The product provided was not found: ID = ${id}`;
      } else if (result?.productUpdated === false) {
        response.status = 400;
        response.message = `Unable to update product with the ID ${id}`;
      } else {
        response.status = 200;
        response.message = `product with the ID ${id} updated successfully`;
      }
    } catch (error) {
      if (error instanceof Error) {
        logger(
          `[CONTROLLER ERROR]: There is a problem when updating a Product: ${error.message}`
        );
      }
      throw error;
    }
    return response;
  }

  @Delete('/:id')
  public async destroyProduct(
    id: number,
    connection?: Sequelize | undefined
  ): Promise<BasicResponse | undefined> {
    const response: BasicResponse | undefined = {
      message: '',
      status: 0,
    };
    try {
      logger(
        `[/api/product/${id ?? ':id'}] Delete the Product: Request`,
        'info',
        'users'
      );
      const result = await deleteProductById(id, connection);
      if (result?.productExist === false) {
        response.status = 400;
        response.message = `The Product provided was not found: ID = ${id}`;
      } else if (result?.productToEliminate === false) {
        response.status = 400;
        response.message = `Unable to delete Product with the ID ${id}`;
      } else {
        response.status = 200;
        response.message = `Product with the ID ${id} was delete successfully`;
      }
    } catch (error) {
      if (error instanceof Error) {
        logger(
          `[CONTROLLER ERROR]: There is a problem when deleting a Product: ${error.message}`
        );
      }
      throw error;
    }
    return response;
  }
}
