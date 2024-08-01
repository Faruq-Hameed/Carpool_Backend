import Joi, { type Schema } from 'joi';

const contentValidator = (data): Joi.ValidationResult => {
  const contentSchema: Schema = Joi.object({
    name: Joi.string().lowercase().required(),
    value: Joi.string(),
    type: Joi.string(),
  });
  // return contentSchema.validate(data);
  return contentSchema.validate(data, {
    abortEarly: false, // Include all errors
    errors: { wrap: { label: '' } },
  });
};

export default contentValidator;
