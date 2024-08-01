import Joi, { type Schema } from 'joi';

const orderValidator = (
  data: unknown,
  update: boolean = false,
): Joi.ValidationResult => {
  const orderSchema: Schema = Joi.object({
    product_id: Joi.string().required(),
    product_name: Joi.string().required(),
    items: Joi.string().required(),
    type: Joi.string().required(),
    category: Joi.string().allow(''),
    images: [Joi.object().allow(''), Joi.array().allow('')],
    ecode: Joi.string().allow(''),
    return_in_ngn: Joi.number().required(),
    return_in_usd: Joi.number(),
    country_code: Joi.string().allow(''),
  });

  // return paymentSchema.validate(data);
  return orderSchema.validate(data, {
    abortEarly: false, // Include all errors
    errors: { wrap: { label: '' } },
  });
};

const updateOrdersValidator = (data: unknown): Joi.ValidationResult => {
  const UpdateOrderSchema: Schema = Joi.object({
    status: Joi.string().required().valid('success', 'declined'),
    description: Joi.string().required(),
    images: Joi.allow(''),
  });
  return UpdateOrderSchema.validate(data, {
    abortEarly: false,
    errors: { wrap: { label: '' } },
  });
};

const creditUserValidator = (data: unknown): Joi.ValidationResult => {
  const creditOrderSchema: Schema = Joi.object({
    amount: Joi.number().required(),
  });
  return creditOrderSchema.validate(data, {
    abortEarly: false,
    errors: { wrap: { label: '' } },
  });
};

export { orderValidator, updateOrdersValidator, creditUserValidator };
