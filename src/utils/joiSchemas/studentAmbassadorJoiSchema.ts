import Joi from 'joi';

const studentAmbassadorValidator = (data): Joi.ValidationResult => {
  const studentAmbassadorSchema = Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    institution: Joi.string().required(),
    level: Joi.number().required(),
    social_media: Joi.array(),
    institution_state: Joi.string().required(),
    position: Joi.string().required(),
    communities: Joi.string().required(),
    events_managed: Joi.number().required(),
    why_ambassador: Joi.string().required(),
    initiative: Joi.string().required(),
    cover_letter: Joi.array(),
  });
  // return studentAmbassadorSchema.validate(data);
  return studentAmbassadorSchema.validate(data, {
    abortEarly: false, // Include all errors
    errors: { wrap: { label: '' } },
  });
};

export default studentAmbassadorValidator;
