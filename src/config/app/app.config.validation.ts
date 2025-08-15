/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Joi from 'joi';
import 'dotenv/config'; // automatically loads .env into process.env

export interface EnvConfig {
  PORT: number;
  NODE_ENV: 'development' | 'production' | 'test';
  FRONTEND_URL: string;
}

export const envSchema = Joi.object({
  PORT: Joi.number().required().default(3000), // Default to 3000 if not provided
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  FRONTEND_URL: Joi.string().uri().default('http://localhost:3000'),
}).unknown(true);

export function appValidateEnv(env: NodeJS.ProcessEnv): EnvConfig {
  const { error, value } = envSchema.validate(env, {
    abortEarly: false,
    convert: true, // Converts strings to numbers etc.
  });

  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return value;
}
