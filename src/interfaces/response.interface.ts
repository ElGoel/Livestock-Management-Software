import { type Model } from 'sequelize';
import { type ICattle } from './cattle.interface';

//* Basic JSON response for Controllers
export interface BasicResponse {
  message: string;
  status: number;
}
export interface CattleResponse {
  message: string;
  item: Model<ICattle, ICattle> | null | undefined;
  status: number;
}

//* Error JSON response for Controllers

export interface DataResponse {
  totalPages: number;
  currentPage: number;
  cattle: Array<Model<ICattle | ICattle>>;
  error?: unknown;
}
