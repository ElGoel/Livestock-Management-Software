import { type Model } from 'sequelize';
import {
  type ICattle,
  type DataResponse,
  type CattleResponse,
  type BasicResponse,
  type IBreed,
} from '../interfaces';

export type CattleResult = Promise<
  DataResponse | Model<IBreed | ICattle> | null | undefined | unknown
>;

export type CreateResult = CattleResponse | BasicResponse | undefined;
