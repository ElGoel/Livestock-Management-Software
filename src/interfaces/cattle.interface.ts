export interface ICattle {
  id?: number;
  number: number;
  breedId: number;
  initWeight: number;
  quarterlyWeight: number;
  ageGroup: string;
  registerDate?: string;
  register: string;
  isDelete?: boolean;
}

export interface IBreed {
  id?: number;
  code?: string;
  origin: string;
  name: string;
  production: string;
  isEditable?: boolean;
  isDelete?: boolean;
}
