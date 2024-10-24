import Joi, { type Schema, type ValidationResult } from 'joi';
import { type IUser } from '../types/user';

/** User validation with joi */
export const userValidator = (
  user: Partial<IUser>,
  update: boolean = false, // specifies whether data is an update or a new data
): ValidationResult => {
  const userValidationSchema: Schema = Joi.object({
    firstname: Joi.string(),
    lastname: Joi.string(),
    username: Joi.string(),
    email: Joi.string().email(),
    profilePicture: Joi.string(),
    occupation: Joi.string(),
    phonenumber: Joi.string()
      .pattern(/^\d{11}$/)
      .messages({
        'string.pattern.base': `Phone number must be 11 digits.`,
      }),
  })
    .min(!update ? 7 : 1) // all fields are required when creating new user
    .messages({
      'object.min':
        'At least one field must be provided for update and all for create.',
    });
  return userValidationSchema.validate(user, {
    abortEarly: false, // Include all errors
    errors: { wrap: { label: '' } },
  });
};
