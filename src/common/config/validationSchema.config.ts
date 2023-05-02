import * as Joi from 'joi';

export const schema = {
  PORT: Joi.number().required(),
};

export const validationSchema = Joi.object(schema);
