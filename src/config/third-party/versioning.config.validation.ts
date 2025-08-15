/* eslint-disable @typescript-eslint/no-unsafe-return */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Joi from 'joi';

export interface VersioningEnvConfig {
  API_DEFAULT_VERSION: string;
}

const versioningEnvSchema = Joi.object({
  API_DEFAULT_VERSION: Joi.string().default('1'),
}).unknown(true);

export function versioningValidateEnv(
  env: NodeJS.ProcessEnv,
): VersioningEnvConfig {
  const { error, value } = versioningEnvSchema.validate(env, {
    abortEarly: false,
    convert: true,
  });

  if (error) {
    throw new Error(`Versioning config validation error: ${error.message}`);
  }

  return value;
}
