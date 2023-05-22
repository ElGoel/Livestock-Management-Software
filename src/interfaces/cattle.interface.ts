export interface ICattle {
  id?: number;
  number: number;
  breedId: number;
  initWeight: number;
  quarterlyWeight: number;
  ageGroup: number;
  registerDate?: string;
  register: string;
}

export interface IBreed {
  id?: number;
  origin: string;
  name: string;
  production: string;
}
