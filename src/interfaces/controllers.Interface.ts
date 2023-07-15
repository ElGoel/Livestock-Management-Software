import { type Sequelize } from 'sequelize';
import {
  type IProducts,
  type IBreed,
  type ICattle,
  type ILots,
} from './cattle.interface';
import { type BasicResponse } from './response.interface';
import { type CattleResult } from '../types/PromiseTypeResponse';

export interface ICattleController<T extends ICattle> {
  // ? Get All Cattle's
  getCattle: (
    page: number,
    limit: number,
    connection: Sequelize,
    id?: number
  ) => CattleResult<T>;

  // ? Create a new Cattle
  createCattle: (
    cattle: ICattle,
    connection: Sequelize
  ) => Promise<BasicResponse | undefined>;

  // ? Get cattle by Number: from 'Cattle' Table
  getCattleById: (name?: number, connection?: Sequelize) => CattleResult<T>;

  // ? Update a Cattle
  updateCattle: (
    id: number,
    cattle: ICattle,
    connection: Sequelize
  ) => Promise<BasicResponse | undefined>;

  // ? Delete a Cattle
  destroyCattle: (
    id: number,
    connection: Sequelize
  ) => Promise<BasicResponse | undefined>;
}

export interface IBreedController<T extends IBreed> {
  // ? Get All Cattle's
  getBreed: (
    page: number,
    limit: number,
    connection: Sequelize,
    id?: number
  ) => CattleResult<T>;

  // ? Create a new Cattle
  createBreed: (
    breed: IBreed,
    connection: Sequelize
  ) => Promise<BasicResponse | undefined>;

  // ? Get cattle by Number: from 'Cattle' Table
  getBreedById: (
    connection: Sequelize,
    query?: string | number | undefined
  ) => CattleResult<T>;

  // ? Update a Cattle
  updateBreed: (
    id: number,
    breed: IBreed,
    connection: Sequelize
  ) => Promise<BasicResponse | undefined>;

  // ? Delete a Cattle
  destroyBreed: (
    id: number,
    connection: Sequelize
  ) => Promise<BasicResponse | undefined>;
}

export interface IProductsController<T extends IProducts> {
  // ? Get All Products
  getProducts: (
    page: number,
    limit: number,
    connection: Sequelize,
    id?: number
  ) => CattleResult<T>;

  // ? Create a new Product
  createProduct: (
    product: IProducts,
    connection: Sequelize
  ) => Promise<BasicResponse | undefined>;

  // ? Get product by Number: from 'Products' Table
  getProductById: (
    connection: Sequelize,
    query?: string | number | undefined
  ) => CattleResult<T>;

  // ? Update a Product
  updateProduct: (
    id: number,
    breed: IProducts,
    connection: Sequelize
  ) => Promise<BasicResponse | undefined>;

  // ? Delete a Product
  destroyProduct: (
    id: number,
    connection: Sequelize
  ) => Promise<BasicResponse | undefined>;
}

export interface ILotsController<T extends ILots> {
  // ? Get All Lots
  getLots: (
    page: number,
    limit: number,
    connection: Sequelize,
    id?: number
  ) => CattleResult<T>;

  // ? Create a new Lot
  createLot: (
    lot: ILots,
    connection: Sequelize
  ) => Promise<BasicResponse | undefined>;

  // ? Get lot by Number: from 'Lots' Table
  getLotById: (
    query?: string | number | undefined,
    connection?: Sequelize
  ) => CattleResult<T>;

  // ? Update a Lot
  updateLot: (
    id: number,
    lot: ILots,
    connection?: Sequelize
  ) => Promise<BasicResponse | undefined>;

  // ? Delete a Lot
  destroyLot: (
    id: number,
    connection?: Sequelize
  ) => Promise<BasicResponse | undefined>;

  getLotsCattle: (id?: number, connection?: Sequelize) => CattleResult<T>;
}
