/* eslint-disable @typescript-eslint/no-unsafe-return */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Joi from 'joi';

export interface JwtEnvConfig {
  JWT_ACCESS_TOKEN_SECRET: string;
  JWT_ACCESS_TOKEN_EXPIRES_IN: string;
  JWT_ACCESS_TOKEN_IGNORE_EXPIRATION: boolean;
  JWT_REFRESH_TOKEN_SECRET: string;
  JWT_REFRESH_TOKEN_EXPIRES_IN: string;
}

const jwtEnvSchema = Joi.object({
  JWT_ACCESS_TOKEN_SECRET: Joi.string().min(10).required(),
  JWT_ACCESS_TOKEN_EXPIRES_IN: Joi.string()
    .pattern(/^\d+[smhd]$/) // e.g. 15m, 7d, 60s, 1h
    .default('15m'),
  JWT_ACCESS_TOKEN_IGNORE_EXPIRATION: Joi.boolean()
    .truthy('true')
    .falsy('false')
    .default(false),
  JWT_REFRESH_TOKEN_SECRET: Joi.string().min(10).required(),
  JWT_REFRESH_TOKEN_EXPIRES_IN: Joi.string()
    .pattern(/^\d+[smhd]$/)
    .default('7d'),
}).unknown(true);

export function jwtValidateEnv(env: NodeJS.ProcessEnv): JwtEnvConfig {
  const { error, value } = jwtEnvSchema.validate(env, {
    abortEarly: false,
    convert: true,
  });

  if (error) {
    throw new Error(`JWT config validation error: ${error.message}`);
  }

  return value;
}
