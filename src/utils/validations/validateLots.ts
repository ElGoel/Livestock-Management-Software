import { type ILots } from '../../interfaces/cattle.interface';

import Joi from 'joi';

export const validateCreateLots = (
  lots: ILots
): Joi.ValidationResult<ILots> => {
  const schema = Joi.object({
    name: Joi.string().required(),
    supplier: Joi.string().required(),
    receiveDate: Joi.date().required(),
    register: Joi.string()
      .pattern(/^([a-zA-ZáéíóúÁÉÍÓÚñÑ]+\s)*[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/)
      .required(),
  });

  return schema.validate(lots);
};

export const validateUpdateLots = (
  lots: unknown
): Joi.ValidationResult<unknown> => {
  const schema = Joi.object({
    name: Joi.string().regex(/^[-Z0-9]+$/),
    supplier: Joi.string(),
    receiveDate: Joi.date(),
    totalCattle: Joi.number(),
    register: Joi.string().pattern(
      /^([a-zA-ZáéíóúÁÉÍÓÚñÑ]+\s)*[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/
    ),
  });

  return schema.validate(lots);
};
