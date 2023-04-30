import { type Model } from 'sequelize';
import { type ICattle, type DataResponse } from '../interfaces';

export type CattleResult = Promise<
  DataResponse | Model<ICattle, ICattle> | null | undefined | unknown
>;
