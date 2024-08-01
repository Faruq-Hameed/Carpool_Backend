import Joi, { type ValidationResult, type Schema } from 'joi';

// Function to validate a transaction

function transactionValidator(data: Record<string, any>): ValidationResult {
  const transactionValidationSchema: Schema = Joi.object({
    user: Joi.string().required(),
    action_id: Joi.string().allow(''),
    name: Joi.string().required(),
    status: Joi.string().required(),
    type: Joi.string().required(),
    amount: Joi.number().required(),
    description: Joi.string().required().max(255),
    images: Joi.array(),
    parent_category: Joi.string().allow(''),
  }).messages({
    'string.base': `{#label} should be a type of 'text'`,
    'string.empty': `{#label} cannot be an empty field`,
    'string.email': `{#label} must be a valid email`,
    'string.min': `{#label} should have a minimum length of {#limit}`,
    'string.max': `{#label} should have a maximum length of {#limit}`,
    'any.required': `{#label} is a required field`,
    'number.base': `{#label} should be a type of 'number'`,
  });

  return transactionValidationSchema.validate(data, {
    abortEarly: false, // Include all errors
    errors: { wrap: { label: '' } },
  });
}

export default transactionValidator;
