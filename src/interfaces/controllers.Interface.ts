import { type Sequelize } from 'sequelize';
import { type IBreed, type ICattle } from './cattle.interface';
import { type BasicResponse } from './response.interface';
import { type CattleResult } from '../types/PromiseTypeResponse';

export interface ICattleController {
  // ? Get All Cattle's
  getCattle: (
    page: number,
    limit: number,
    connection: Sequelize,
    id?: number
  ) => CattleResult;

  // ? Create a new Cattle
  createCattle: (
    cattle: ICattle,
    connection: Sequelize
  ) => Promise<BasicResponse | undefined>;

  // ? Get cattle by Number: from 'Cattle' Table
  getCattleById: (name?: number, connection?: Sequelize) => CattleResult;

  // ? Update a Cattle
  updateCattle: (
    id: number,
    cattle: ICattle,
    connection?: Sequelize
  ) => Promise<BasicResponse | undefined>;

  // ? Delete a Cattle
  destroyCattle: (
    id: number,
    connection?: Sequelize
  ) => Promise<BasicResponse | undefined>;
}

export interface IBreedController {
  // ? Get All Cattle's
  getBreed: (
    page: number,
    limit: number,
    connection: Sequelize,
    id?: number
  ) => CattleResult;

  // ? Create a new Cattle
  createBreed: (
    breed: IBreed,
    connection: Sequelize
  ) => Promise<BasicResponse | undefined>;

  // ? Get cattle by Number: from 'Cattle' Table
  getBreedById: (
    query?: string | number | undefined,
    connection?: Sequelize
  ) => CattleResult;

  // ? Update a Cattle
  updateBreed: (
    id: number,
    breed: IBreed,
    connection?: Sequelize
  ) => Promise<BasicResponse | undefined>;

  // ? Delete a Cattle
  destroyBreed: (
    id: number,
    connection?: Sequelize
  ) => Promise<BasicResponse | undefined>;
}
