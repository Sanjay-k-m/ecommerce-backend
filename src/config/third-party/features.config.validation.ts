/* eslint-disable @typescript-eslint/no-unsafe-return */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Joi from 'joi';

export interface FeaturesEnvConfig {
  ENABLE_HELMET: boolean;
  ENABLE_SWAGGER: boolean;
  ENABLE_LOGGING_INTERCEPTOR: boolean;
  ENABLE_GLOBAL_VALIDATION_PIPE: boolean;
  COMPRESSION_ENABLED: boolean;
  ENABLE_THROTTLE: boolean;
}

const featuresEnvSchema = Joi.object({
  ENABLE_HELMET: Joi.boolean().truthy('true').falsy('false').default(true),
  ENABLE_SWAGGER: Joi.boolean().truthy('true').falsy('false').default(true),
  ENABLE_LOGGING_INTERCEPTOR: Joi.boolean()
    .truthy('true')
    .falsy('false')
    .default(true),
  ENABLE_GLOBAL_VALIDATION_PIPE: Joi.boolean()
    .truthy('true')
    .falsy('false')
    .default(true),
  COMPRESSION_ENABLED: Joi.boolean()
    .truthy('true')
    .falsy('false')
    .default(true),
  ENABLE_THROTTLE: Joi.boolean().truthy('true').falsy('false').default(true),
}).unknown(true);

export function featuresValidateEnv(env: NodeJS.ProcessEnv): FeaturesEnvConfig {
  const { error, value } = featuresEnvSchema.validate(env, {
    abortEarly: false,
    convert: true,
  });

  if (error) {
    throw new Error(`Features config validation error: ${error.message}`);
  }

  return value;
}
