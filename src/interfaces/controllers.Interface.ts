import { type ICattle } from './cattle.interface';
import { type BasicResponse } from './response.interface';

export interface IHelloController {
  getMessage: (name?: string) => Promise<BasicResponse>;
}

export interface ICattleController {
  // ? Get All Cattle's || Get cattle by Number: from 'Cattle' Table
  // getCattle: (page: number, limit: number, id?: string) => Promise<any>;

  // ? Create a new Cattle
  createCattle: (cattle: ICattle) => Promise<any>;

  // // ? Update a Cattle
  // updateCattle: (id: string, cattle: ICattle) => Promise<any>;

  // // ? Delete a Cattle
  // deleteCattle: (id: string) => Promise<any>;
}
