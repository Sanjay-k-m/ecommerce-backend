/* eslint-disable @typescript-eslint/no-unsafe-return */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Joi from 'joi';

export interface SwaggerEnvConfig {
  ENABLE_SWAGGER: boolean;
}

const swaggerEnvSchema = Joi.object({
  ENABLE_SWAGGER: Joi.boolean().truthy('true').falsy('false').default(false),
}).unknown(true);

export function swaggerValidateEnv(env: NodeJS.ProcessEnv): SwaggerEnvConfig {
  const { error, value } = swaggerEnvSchema.validate(env, {
    abortEarly: false,
    convert: true,
  });

  if (error) {
    throw new Error(`Swagger config validation error: ${error.message}`);
  }

  return value;
}
