import { type Model } from 'sequelize';
import { type IDataItems, type Data } from '../types/dataTypes';
//* Basic JSON response for Controllers
export interface BasicResponse {
  message: string;
  status: number;
}
export interface CattleResponse<T extends IDataItems> {
  message: string;
  item: Model<T> | null | undefined;
  status: number;
}

//* Error JSON response for Controllers

export interface DataResponse<T extends IDataItems> {
  totalPages: number;
  currentPage: number;
  item: Data<T>;
  error?: unknown;
}

export interface RelationsResponse<T extends IDataItems> {
  id: number;
  name: string | null;
  register: string | null;
  data: Data<T>;
  error?: unknown;
}
