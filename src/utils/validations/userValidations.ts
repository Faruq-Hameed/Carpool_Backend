import Joi, { type Schema, type ValidationResult } from 'joi';
import { type IUser } from '../types/user';

/** User validation with joi */
export const userValidator = (
  user: Partial<IUser>,
  update: boolean = false, // specifies whether data is an update or a new data
): ValidationResult => {
  const userValidationSchema: Schema = Joi.object({
    firstname: update ? Joi.string().required() : Joi.string(),
    lastname: update ? Joi.string().required() : Joi.string(),
    password: Joi.string()
    .pattern(/^\d{6}$/)
    .required()
    .messages({
      'string.pattern.base': 'Password must be exactly 6 digits',
      'any.required': 'Password is required'
    }),
    username: update ? Joi.string().required() : Joi.string(),
    email: update ? Joi.string().email().required() : Joi.string(),
    profilePicture: update ? Joi.string().required() : Joi.string(),
    occupation: update ? Joi.string().required() : Joi.string(),
    phonenumber: update ? Joi.string().required() : Joi.string()
  })
  return userValidationSchema.validate(user, {
    abortEarly: false, // Include all errors
    errors: { wrap: { label: '' } },
  });
};
