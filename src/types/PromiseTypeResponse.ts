import { type Model } from 'sequelize';
import {
  type DataResponse,
  type CattleResponse,
  type BasicResponse,
} from '../interfaces';
import { type IDataItems } from './dataTypes';

export type CattleResult<T extends IDataItems> = Promise<
  DataResponse<T> | Model<T> | null | undefined | unknown
>;

export type CreateResult<T extends IDataItems> =
  | CattleResponse<T>
  | BasicResponse
  | undefined;
