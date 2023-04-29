import { type Sequelize, type Model } from 'sequelize';
import { type ICattle } from './cattle.interface';
import { type DataResponse, type BasicResponse } from './response.interface';

export interface ICattleController {
  // ? Get All Cattle's || Get cattle by Number: from 'Cattle' Table
  getCattle: (
    page: number,
    limit: number,
    connection: Sequelize,
    id?: string
  ) => Promise<DataResponse | unknown | undefined>;

  // ? Create a new Cattle
  createCattle: (
    cattle: ICattle,
    connection: Sequelize
  ) => Promise<BasicResponse | Model<ICattle> | undefined>;

  // // ? Update a Cattle
  // updateCattle: (id: string, cattle: ICattle) => Promise<any>;

  // // ? Delete a Cattle
  // deleteCattle: (id: string) => Promise<any>;
}
