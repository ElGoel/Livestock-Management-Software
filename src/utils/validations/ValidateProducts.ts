import { type IProducts } from '../../interfaces/cattle.interface';

import Joi from 'joi';

export const validateCreateProducts = (
  products: IProducts
): Joi.ValidationResult<IProducts> => {
  const schema = Joi.object({
    CattleId: Joi.number().required(),
    totalMilk: Joi.number().required(),
    notes: Joi.string(),
  });

  return schema.validate(products);
};

export const validateUpdateProducts = (
  products: unknown
): Joi.ValidationResult<unknown> => {
  const schema = Joi.object({
    CattleId: Joi.number(),
    totalMilk: Joi.number(),
    notes: Joi.string(),
  });

  return schema.validate(products);
};
