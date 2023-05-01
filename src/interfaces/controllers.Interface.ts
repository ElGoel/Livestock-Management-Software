import { type Sequelize } from 'sequelize';
import { type ICattle } from './cattle.interface';
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

  // // ? Delete a Cattle
  // deleteCattle: (id: string) => Promise<any>;
}
