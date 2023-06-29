import { type Model } from 'sequelize';
import { type IBreed, type ICattle } from './cattle.interface';

//* Basic JSON response for Controllers
export interface BasicResponse {
  message: string;
  status: number;
}
export interface CattleResponse {
  message: string;
  item: Model<ICattle | IBreed> | null | undefined;
  status: number;
}

//* Error JSON response for Controllers

export interface DataResponse {
  totalPages: number;
  currentPage: number;
  data: Array<Model<ICattle | ICattle> | Model<IBreed | IBreed>>;
  error?: unknown;
}
