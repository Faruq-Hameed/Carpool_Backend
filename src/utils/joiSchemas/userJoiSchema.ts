import Joi, { type Schema } from 'joi';
import { UserStatus as CustomerStatus } from '@/utils/types';

export const userValidator = (
  data: unknown,
  update?: boolean,
): Joi.ValidationResult => {
  const userSchema: Schema = Joi.object({
    firstname: update
      ? Joi.string().lowercase().required()
      : Joi.string().lowercase(),
    lastname: update
      ? Joi.string().lowercase().required()
      : Joi.string().lowercase(),
    email: Joi.string().email().required(),
    username: Joi.string()
      .regex(/^\S+$/, 'usernamenowhitespace')
      .trim()
      .required(),
    password: Joi.string().min(8).required(),
    isAdmin: Joi.boolean().optional(),
    referrer: Joi.string(),
    channel: Joi.string().valid('APP', 'WEB').default('WEB'),
  });
  // return userSchema.validate(data);
  return userSchema.validate(data, {
    abortEarly: false, // Include all errors
    errors: { wrap: { label: '' } },
  });
};

// joi validator for user status update i.e block, deleted or active
export const customerStatusValidator = (
  data: unknown,
): Joi.ValidationResult => {
  const customerStatusSchema = Joi.object({
    status: Joi.string()
      .valid(...Object.values(CustomerStatus))
      .required(),
  });
  return customerStatusSchema.validate(data);
};

// // joi validator for user status update i.e block, deleted or active
// export const customerNoteValidator = (
//   data: Record<string, any>,
// ): Joi.ValidationResult => {
//   const customerNoteSchema = Joi.object({
//     note: Joi.string()
//       .required(),
//   });
//   return customerStatusSchema.validate(data);
// };
