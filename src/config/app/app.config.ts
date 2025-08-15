// src/config/app.config.ts
import { EnvConfig, appValidateEnv } from './app.config.validation';

const validatedEnv: EnvConfig = appValidateEnv(process.env);

export const appConfig = () => ({
  port: validatedEnv.PORT,
  nodeEnv: validatedEnv.NODE_ENV,
  frontendUrl: validatedEnv.FRONTEND_URL,
});
