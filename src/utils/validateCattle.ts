import { type ICattle } from '../interfaces/cattle.interface';

import Joi from 'joi';

export const validateCattle = (
  cattle: ICattle
): Joi.ValidationResult<ICattle> => {
  const schema = Joi.object({
    number: Joi.number().min(3).required(),
    race: Joi.number().max(11).required(),
    initWeight: Joi.number().precision(2).required(),
    quarterlyWeight: Joi.number().precision(2).required(),
    register: Joi.string()
      .pattern(/^([a-zA-ZáéíóúÁÉÍÓÚñÑ]+\s)*[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/)
      .required(),
  });

  return schema.validate(cattle);
};
