import {
  databaseValidateEnv,
  DatabaseEnvConfig,
} from './database.config.validator';

const validatedEnv: DatabaseEnvConfig = databaseValidateEnv(process.env);

export const databaseConfig = () => ({
  url: validatedEnv.DATABASE_URL,
});
