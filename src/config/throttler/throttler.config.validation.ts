/* eslint-disable @typescript-eslint/no-unsafe-return */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Joi from 'joi';

export interface ThrottlerEnvConfig {
  THROTTLE_TTL_MS: number;
  THROTTLE_LIMIT: number;
  THROTTLE_BLOCK_DURATION_MS: number;
}

const throttlerEnvSchema = Joi.object({
  THROTTLE_TTL_MS: Joi.number().integer().min(1000).default(60000),
  THROTTLE_LIMIT: Joi.number().integer().min(1).default(10),
  THROTTLE_BLOCK_DURATION_MS: Joi.number().integer().min(1000).default(300000),
}).unknown(true);

export function throttlerValidateEnv(
  env: NodeJS.ProcessEnv,
): ThrottlerEnvConfig {
  const { error, value } = throttlerEnvSchema.validate(env, {
    abortEarly: false,
    convert: true,
  });

  if (error) {
    throw new Error(`Throttler config validation error: ${error.message}`);
  }

  return value;
}
