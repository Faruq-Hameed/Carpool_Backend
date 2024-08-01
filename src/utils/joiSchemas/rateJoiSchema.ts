import Joi, { type Schema } from 'joi';

const rateValidator = (
  data: unknown,
  update: boolean = false, // specifies whether data is an update or a new data
): Joi.ValidationResult => {
  const rateSchema: Schema = Joi.object({
    high: update ? Joi.number().min(1) : Joi.number().min(1).required(),
    low: update ? Joi.number().min(1) : Joi.number().min(1).required(),
    value: update ? Joi.number().min(1) : Joi.number().min(1).required(),
    ...(!update && { product_id: Joi.string().required() }),
    country_code: update ? Joi.string() : Joi.string().required(),
    featured: update ? Joi.boolean() : Joi.boolean().required(),
  });
  // return rateSchema.validate(data)
  return rateSchema.validate(data, {
    abortEarly: false, // Include all errors
    errors: { wrap: { label: '' } },
  });
};

export default rateValidator;
