import { type ICattle } from '../../interfaces/cattle.interface';

import Joi from 'joi';

export const validateCreateCattle = (
  cattle: ICattle
): Joi.ValidationResult<ICattle> => {
  const schema = Joi.object({
    number: Joi.number().min(3).required(),
    BreedId: Joi.number().min(1).required(),
    LotId: Joi.number().min(1).required(),
    initWeight: Joi.number().precision(2).required(),
    quarterlyWeight: Joi.number().greater(Joi.ref('initWeight')).precision(2),
    ageGroup: Joi.string().required(),
    register: Joi.string()
      .pattern(/^([a-zA-ZáéíóúÁÉÍÓÚñÑ]+\s)*[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/)
      .required(),
  });

  return schema.validate(cattle);
};

export const validateUpdateCattle = (
  cattle: unknown
): Joi.ValidationResult<unknown> => {
  const schema = Joi.object({
    number: Joi.number().min(3),
    breedId: Joi.number().min(1),
    initWeight: Joi.number().precision(2),
    quarterlyWeight: Joi.number().greater(Joi.ref('initWeight')).precision(2),
    ageGroup: Joi.number().min(1).max(4),
    register: Joi.string()
      .max(255)
      .pattern(/^([a-zA-ZáéíóúÁÉÍÓÚñÑ]+\s)*[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/),
  });

  return schema.validate(cattle);
};
