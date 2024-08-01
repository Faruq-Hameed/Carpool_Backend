import Joi, { type Schema } from 'joi';

const productValidator = (
  data: unknown,
  update: boolean = false, // specifies whether data is an update or a new data
): Joi.ValidationResult => {
  const productSchema: Schema = Joi.object({
    name: update
      ? Joi.string().lowercase()
      : Joi.string().lowercase().required(),
    country_code: Joi.string(),
    image: Joi.string(),
    background: Joi.string(),
    type: update
      ? Joi.string().valid('card', 'coin')
      : Joi.string().valid('card', 'coin').required(),
    code: Joi.string().uppercase(),
    wallet_address: Joi.string(),
    qrcode: Joi.string(),
  });
  // return productSchema.validate(data);
  return productSchema.validate(data, {
    abortEarly: false, // Include all errors
    errors: { wrap: { label: '' } },
  });
};

export default productValidator;
