export interface ICattle {
  id?: number;
  number: number;
  initWeight: number;
  quarterlyWeight: number;
  ageGroup: string;
  registerDate?: string;
  register: string;
  isDelete?: boolean;
  BreedId?: number;
  LotId?: number;
}

export interface ILots {
  id?: number;
  name: string;
  supplier: string;
  receiveDate: Date;
  totalCattle?: number;
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

export interface IProducts {
  id?: number;
  CattleId?: number;
  date?: Date;
  totalMilk: number;
  notes: string;
  isDelete?: boolean;
}
