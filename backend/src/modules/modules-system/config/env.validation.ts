// import * as Joi from "joi";
// import { TITLE } from "src/common/constant/app.constant";

// export const envValidation = Joi.object({
//     // Application
//     PORT: Joi.number().required(),
//     // NODE_ENV: Joi.string().valid("development", "production", "test").default("development"),

//     // MongoDB configuration
//     DATABASE_URL: Joi.string().required(),

//     DOMAIN_BE: Joi.string().required(),
//     DOMAIN_FE: Joi.string().required(),

//     // Redis configuration
//     REDIS_URL: Joi.string().required(),

//     // Telegram configuration
//     TG_BOT_TOKEN: Joi.string().optional(),
//     TG_CHAT_ID: Joi.string().optional(),
//     TG_THREAD_ID: Joi.string().optional(),

//     MAGIC_LINK_TOKEN_SECRET: Joi.string().optional(),
//     MAGIC_LINK_TOKEN_EXPIRES: Joi.string().optional(),
//     MAGIC_LINK_EMAIL_SECRET: Joi.string().optional(),

//     ACCESS_TOKEN_SECRET: Joi.string().optional(),
//     ACCESS_TOKEN_EXPIRES: Joi.string().optional(),
//     REFRESH_TOKEN_SECRET: Joi.string().optional(),
//     REFRESH_TOKEN_EXPIRES: Joi.string().optional(),

//     GOOGLE_CLIENT_ID: Joi.string().optional(),
//     GOOGLE_CLIENT_SECRET: Joi.string().optional(),

//     TOTP_ENABLED: Joi.boolean().default(false),

//     EMAIL_HOST: Joi.string().required(),
//     EMAIL_PORT: Joi.number().required(),
//     EMAIL_USER: Joi.string().required(),
//     EMAIL_PASS: Joi.string().required(),
//     EMAIL_FROM: Joi.string().required(),
// });
