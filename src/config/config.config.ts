import * as Joi from "joi";

import "dotenv/config";

const envValidation = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    PORT: Joi.number().default(5000),

    DATABASE_URL: Joi.string().required(),
    MONGO_PASSWORD: Joi.string().required(),
    MONGO_PATH: Joi.string().required(),
    MONGO_USER: Joi.string().required(),

    LOG_FOLDER: Joi.string().required(),
    LOG_FILE: Joi.string().required(),
    LOG_LEVEL: Joi.string().required(),
  })
  .unknown();

const { value: envVar, error } = envValidation
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
  env: envVar.NODE_ENV,
  port: envVar.PORT,
  mongodb: {
    db_url: envVar.DATABASE_URL,
    mongo_user: envVar.MONGO_USER,
    mongo_pass: envVar.MONGO_PASSWORD,
    mongo_path: envVar.MONGO_PATH,
  },
  logConfig: {
    logFolder: envVar.LOG_FOLDER,
    logFile: envVar.LOG_FILE,
    logLevel: envVar.LOG_LEVEL,
  },
};
