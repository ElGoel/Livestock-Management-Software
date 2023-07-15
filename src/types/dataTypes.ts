// import {
//   type ILots,
//   type IBreed,
//   type ICattle,
//   type IProducts,
// } from '../interfaces';
import {
  type IBreed,
  type ICattle,
  type ILots,
  type IProducts,
} from '../interfaces';
import { type Model } from 'sequelize';

export type ModelType<T extends IDataItems> = Model<T>;

export type IDataItems = ICattle | IBreed | IProducts | ILots;

export type Data<T extends IDataItems> = Array<ModelType<T>>;
