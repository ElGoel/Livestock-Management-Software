import { type Model } from 'sequelize';
import {
  type ICattle,
  type DataResponse,
  type CattleResponse,
  type BasicResponse,
} from '../interfaces';

export type CattleResult = Promise<
  DataResponse | Model<ICattle, ICattle> | null | undefined | unknown
>;

export type CreateResult = CattleResponse | BasicResponse | undefined;
