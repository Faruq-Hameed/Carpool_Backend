import Joi from 'joi';
import { type ICar } from '@/utils/types';

// Joi schema for car validation
export const createCarValidator = (
  data: Partial<ICar>,
): Joi.ValidationResult => {
  const CarSchema = Joi.object({
    owner: Joi.string().hex().length(24).required(), // Ensures it's a valid ObjectId
    maker: Joi.string().min(2).max(100).required(), // Car model (e.g., "Toyota")
    model: Joi.string().min(2).max(100).required(), // Car model (e.g., "Toyota Corolla")
    year: Joi.string().length(4).required(), // Car year (e.g., "2006")
    color: Joi.string().min(3).required(), // Car color (e.g., "red")
    licensePlate: Joi.string().min(2).max(20).required(), // License plate number
    seats: Joi.number().integer().min(1).required(), // Number of seats in the car
    // pictures: Joi.array().items(Joi.string().uri()).min(2), // Array of minimum of 2pictures (URLs)        seats: Joi.number().integer().min(1).required(), // Number of seats in the car
    // isVerified: Joi.boolean().default(false),        // Default false for new cars
    // status: Joi.string().valid(...Object.values(Status)).required(),  // Valid status options from Status enum
    // verificationData: Joi.string().optional(),       // Can be an encrypted string or optional at creation
  });
  // return CarSchema.validate(data);
  return CarSchema.validate(data, {
    abortEarly: false, // Include all errors
    errors: { wrap: { label: '' } },
  });
};

/**
 * validating ride search request
 * @param startLat: starting latitude as number
 * @param startLng: starting longitude as number
 * @param destLat: destination latitude as number
 * @param destLng: destination longitude as number
 *
 * */
export const validateRideSearch = (data: any): Joi.ValidationResult => {
  const searchRideSchema = Joi.object({
    startLng: Joi.number().min(1).required(), // starting longitude
    startLat: Joi.number().min(1).required(), // starting latitude
    destLng: Joi.number().min(1).required(), // destination longitude
    destLat: Joi.number().min(1).required(), // destination latitude
    radius: Joi.number().min(1).required(), // radius(variation) of the distance
  });
  // return rideSchema.validate(data);
  return searchRideSchema.validate(data, {
    abortEarly: false, // Include all errors
    errors: { wrap: { label: '' } },
  });
};
// export const userValidator = (
//     data: unknown,
//     update?: boolean,
//   ): Joi.ValidationResult => {
//     const userSchema: Schema = Joi.object({
//       firstname: update
//         ? Joi.string().lowercase().required()
//         : Joi.string().lowercase(),
//       lastname: update
//         ? Joi.string().lowercase().required()
//         : Joi.string().lowercase(),
//       email: Joi.string().email().required(),
//       username: Joi.string()
//         .regex(/^\S+$/, 'usernamenowhitespace')
//         .trim()
//         .required(),
//       password: Joi.string().min(8).required(),
//       isAdmin: Joi.boolean().optional(),
//       referrer: Joi.string(),
//       channel: Joi.string().valid('APP', 'WEB').default('WEB'),
//     });
//     // return userSchema.validate(data);
//     return userSchema.validate(data, {
//       abortEarly: false, // Include all errors
//       errors: { wrap: { label: '' } },
//     });
//   };
