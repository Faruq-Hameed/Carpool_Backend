
import Joi from "joi";

import "dotenv/config";

const envValidation = Joi.object()
    .keys({
        PORT: Joi.number().required().default(3000),
        NODE_ENV: Joi.string().valid("development", "production", "test").required(),

        MAIL_CLIENT_PASSWORD: Joi.string().required(),
        MAIL_CLIENT_USERNAME: Joi.string().required(),
        MAIL_SERVICE_CLIENT: Joi.string().required(),
        MAIL_PRIVATE_KEY: Joi.string().required(),

        jwtPrivateKey: Joi.string().required(),

        TWILIO_ACCOUNT_SID: Joi.string().required(),
        TWILIO_AUTH_TOKEN: Joi.string().required(),

        PRIMARY_DOMAIN: Joi.string().required(),

        CLOUDINARY_CLOUD_NAME: Joi.string().required(),
        CLOUDINARY_API: Joi.string().required(),
        CLOUDINARY_SECRET: Joi.string().required(),

        FLUTTERWAVE_SECRET: Joi.string().required(),
        FLUTTERWAVE_PUBLIC: Joi.string().required(),

        NOTIFICATION_EMAIL: Joi.string().required(),

        MONGODB_URI: Joi.string().required(),

        // FLUTTERWAVE_SECRET: Joi.string().required(),
        // FLUTTERWAVE_PUBLIC: Joi.string().required(),

        WATU_IV_KEY: Joi.string().required(),
        WATU_ENCRYPTION_KEY: Joi.string().required(),
        WATU_SECRET_KEY: Joi.string().required(),
        WATU_PUBLIC_KEY: Joi.string().required(),
        WATU_PIN: Joi.string().required(),
        MAXIMUM_WITHDRAW: Joi.number().required(),

        MAIL_HOST: Joi.string().required(),
        MAIL_USERNAME: Joi.string().required(),
        MAIL_PASSWORD: Joi.string().required(),

        jwtRefreshTokenKey: Joi.string().required(),
        secretOrPrivateKey: Joi.string().required(),

        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES: Joi.string().required().default("30m"),

        LOG_FOLDER: Joi.string().required(),
        LOG_FILE: Joi.string().required(),
        LOG_LEVEL: Joi.string().required(),
    })
    .unknown();

const { value: envVar, error } = envValidation
    .prefs({ errors: { label: "key" } })
    .validate(process.env);

if (error) {
    throw new Error(`Cannot Start Server:- Config Validation Error: ${error.message}`);
}

export const config = {

    logConfig: {
        logFolder: envVar.LOG_FOLDER,
        logFile: envVar.LOG_FILE,
        logLevel: envVar.LOG_LEVEL
    },
    mail: {
        cl_password: envVar.MAIL_CLIENT_PASSWORD,
        cl_username: envVar.MAIL_CLIENT_USERNAME,
        service: envVar.MAIL_SERVICE_CLIENT,
        privateKey: envVar.MAIL_PRIVATE_KEY,
        host: envVar.MAIL_HOST,
        username: envVar.MAIL_USERNAME,
        password: envVar.MAIL_PASSWORD,

    },
    jwt: {
        secret: envVar.JWT_SECRET,
        expiresIn: envVar.JWT_EXPIRES,
        privateKey: envVar.jwtPrivateKey,
        refreshTokenKey: envVar.jwtRefreshTokenKey,
        secretOrPrivateKey: envVar.secretOrPrivateKey,
    },
    twilio: {
        accountSid: envVar.TWILIO_ACCOUNT_SID,
        authToken: envVar.TWILIO_AUTH_TOKEN,
    },

    PRIMARY_DOMAIN: envVar.PRIMARY_DOMAIN,

    cloudinary: {
        cloud_name: envVar.CLOUDINARY_CLOUD_NAME,
        api_key: envVar.CLOUDINARY_API,
        api_secret: envVar.CLOUDINARY_SECRET,
    },
    flutterwave: {
        secret: envVar.FLUTTERWAVE_SECRET,
        public: envVar.FLUTTERWAVE_PUBLIC,
    },
    watu: {
        iv_key: envVar.WATU_IV_KEY,
        encryption_key: envVar.WATU_ENCRYPTION_KEY,
        secret_key: envVar.WATU_SECRET_KEY,
        public_key: envVar.WATU_PUBLIC_KEY,
        pin: envVar.WATU_PIN,
    },
    notifyEmail: envVar.NOTIFICATION_EMAIL,
    dBUrl: envVar.MONGODB_URI,
    port: envVar.PORT,
    serverEnv: envVar.NODE_ENV,
};
