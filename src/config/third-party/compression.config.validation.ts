/* eslint-disable @typescript-eslint/no-unsafe-return */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Joi from 'joi';

export interface CompressionEnvConfig {
  COMPRESSION_THRESHOLD: number;
  COMPRESSION_LEVEL: number;
}

const compressionEnvSchema = Joi.object({
  COMPRESSION_THRESHOLD: Joi.number().integer().min(0).default(1024),
  COMPRESSION_LEVEL: Joi.number().integer().min(0).max(9).default(6),
}).unknown(true);

export function compressionValidateEnv(
  env: NodeJS.ProcessEnv,
): CompressionEnvConfig {
  const { error, value } = compressionEnvSchema.validate(env, {
    abortEarly: false,
    convert: true,
  });

  if (error) {
    throw new Error(`Compression config validation error: ${error.message}`);
  }

  return value;
}
