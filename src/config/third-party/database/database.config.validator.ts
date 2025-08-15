/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Joi from 'joi';

export interface DatabaseEnvConfig {
  DATABASE_URL: string;
}

const databaseEnvSchema = Joi.object({
  DATABASE_URL: Joi.string().uri().required().messages({
    'string.uri': 'DATABASE_URL must be a valid database connection string',
    'any.required': 'DATABASE_URL is required',
  }),
}).unknown(true);

export function databaseValidateEnv(env: NodeJS.ProcessEnv): DatabaseEnvConfig {
  const { error, value } = databaseEnvSchema.validate(env, {
    abortEarly: false,
    convert: true,
  });

  if (error) {
    throw new Error(`Database config validation error: ${error.message}`);
  }

  return value as DatabaseEnvConfig;
}
