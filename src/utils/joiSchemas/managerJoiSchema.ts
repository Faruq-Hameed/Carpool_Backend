import Joi, { type ValidationResult, type Schema } from 'joi';
import { JobTitle, type IManager } from '@/database/models';
import type {
  IManagerChangePass,
  IManagerLogin,
} from '@/interfaces/backoffice/authInterface';

// Function to validate a manager
function managerValidator(
  manager: Partial<IManager>,
  update: boolean = false, // specifies whether data is an update or a new data
): ValidationResult {
  const managerValidationSchema: Schema = Joi.object({
    username: Joi.string(),
    email: Joi.string().email(),
    phonenumber: Joi.string()
      .pattern(/^\d{11}$/)

      .messages({
        'string.pattern.base': `Phone number must be 11 digits.`,
      }),
    password: Joi.string(),
    firstname: Joi.string(),
    lastname: Joi.string(),
    job_title: Joi.string().valid(...Object.values(JobTitle)),
  })
    .min(!update ? 7 : 1) // all fields are required when creating new manager
    .messages({
      'object.min':
        'At least one field must be provided for update and all for create.',
    });

  // return managerValidationSchema.validate(manager);
  return managerValidationSchema.validate(manager, {
    abortEarly: false, // Include all errors
    errors: { wrap: { label: '' } },
  });
}

function managerLoginValidator(
  manager: Partial<IManagerLogin>,
): ValidationResult {
  const managerLoginSchema: Schema = Joi.object({
    userinfo: Joi.string()
      .required()
      .messages({
        'string.pattern.base': `please provide your username or email`,
      }),
    password: Joi.string()
      .required()
      .messages({ 'string.pattern.base': `please provide your password` }),
  });
  return managerLoginSchema.validate(manager, {
    abortEarly: false, // Include all errors
    errors: { wrap: { label: '' } },
  });
}

function managerChangePassValidator(
  manager: Partial<IManagerChangePass>,
): ValidationResult {
  const managerChangePassSchema: Schema = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string()
      .required()
      .min(8)
      .max(50)
      .custom((value: string, helpers) => {
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasDigit = /\d/.test(value);
        const hasSpecialChar = /[@$!%*?&#*_+]/.test(value);

        if (!hasUpperCase) {
          return helpers.message({
            custom: 'Password must contain at least one uppercase letter.',
          });
        }
        if (!hasLowerCase) {
          return helpers.message({
            custom: 'Password must contain at least one lowercase letter.',
          });
        }
        if (!hasDigit) {
          return helpers.message({
            custom: 'Password must contain at least one digit.',
          });
        }
        if (!hasSpecialChar) {
          return helpers.message({
            custom: 'Password must contain at least one special character.',
          });
        }
        return value; // If all checks pass, return the value.
      }),
  });

  return managerChangePassSchema.validate(manager, {
    abortEarly: false, // Include all errors
    errors: { wrap: { label: '' } },
  });
}

export { managerValidator, managerLoginValidator, managerChangePassValidator };
