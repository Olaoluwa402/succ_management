import { cleanEnv, port, str } from "envalid";

const validateEnv = (): void => {
  cleanEnv(process.env, {
    NODE_ENV: str({
      choices: ["development", "production"],
    }),
    MONGO_PASSWORD: str(),
    MONGO_USER: str(),
    MONGO_PATH: str(),
    PORT: port({ default: 5000 }),
    JWT_SECRET: str(),
  });
};

export default validateEnv;
