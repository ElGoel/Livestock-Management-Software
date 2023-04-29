import { type Model } from 'sequelize';
import { type ICattle } from './cattle.interface';

//* Basic JSON response for Controllers
export interface BasicResponse {
  message: string;
}

//* Error JSON response for Controllers

export interface ErrorResponse {
  error: string;
  statusText: string;
  message: string;
}

export interface DataResponse {
  totalPages: number;
  currentPage: number;
  cattle: Array<Model<ICattle | ICattle>>;
  error?: unknown;
}
