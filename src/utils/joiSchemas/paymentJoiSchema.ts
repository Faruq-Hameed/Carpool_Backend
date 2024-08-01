import Joi, { type Schema } from 'joi';

const paymentValidator = (
  data: unknown,
  update: boolean = false,
): Joi.ValidationResult => {
  const paymentSchema: Schema = Joi.object({
    amount: Joi.number().required().min(1),
    bank: Joi.string().required(),
    account_no: Joi.string().required(),
    status: Joi.string().required().valid(['pending', 'success', 'declined']),
    transaction: Joi.string().required(),
    user: Joi.string().required(),
    balance: Joi.number().required(),
    account_name: Joi.string().required(),
  });

  // return paymentSchema.validate(data);
  return paymentSchema.validate(data, {
    abortEarly: false, // Include all errors
    errors: { wrap: { label: '' } },
  });
};

// export default paymentValidator;

const updatePaymentValidator = (data: unknown): Joi.ValidationResult => {
  const UpdatePaymentSchema: Schema = Joi.object({
    paymentId: Joi.string().required(),
    status: Joi.string().required().valid('success', 'declined'),
    user: Joi.object().required(),
  });
  return UpdatePaymentSchema.validate(data, {
    abortEarly: false,
    errors: { wrap: { label: '' } },
  });
};

export { paymentValidator, updatePaymentValidator };
