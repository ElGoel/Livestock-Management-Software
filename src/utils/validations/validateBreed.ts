import { type IBreed } from '../../interfaces/cattle.interface';

import Joi from 'joi';

export const validateCreateBreed = (
  breed: IBreed
): Joi.ValidationResult<IBreed> => {
  const schema = Joi.object({
    code: Joi.string().min(2),
    origin: Joi.string().min(3).required(),
    name: Joi.string().min(3).required(),
    production: Joi.string().required(),
    isEditable: Joi.boolean(),
  });

  return schema.validate(breed);
};

export const validateUpdateCattle = (
  breed: unknown
): Joi.ValidationResult<unknown> => {
  const schema = Joi.object({
    code: Joi.string().min(2),
    origin: Joi.string().min(3),
    name: Joi.string().min(3),
    production: Joi.string(),
  });

  return schema.validate(breed);
};
