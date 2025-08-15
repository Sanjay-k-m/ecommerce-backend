/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Joi from 'joi';

export interface CorsEnvConfig {
  CORS_ORIGIN: string;
}

const corsEnvSchema = Joi.object({
  CORS_ORIGIN: Joi.string()
    .default('http://localhost:3000')
    .custom((value, helpers) => {
      // Validate comma-separated URLs
      const origins = value.split(',').map((o) => o.trim());
      for (const origin of origins) {
        try {
          new URL(origin);
        } catch {
          return helpers.error('any.invalid');
        }
      }
      return value;
    }, 'Comma-separated URL validation'),
}).unknown(true);

export function corsValidateEnv(env: NodeJS.ProcessEnv): CorsEnvConfig {
  const { error, value } = corsEnvSchema.validate(env, {
    abortEarly: false,
    convert: true,
  });

  if (error) {
    throw new Error(`CORS config validation error: ${error.message}`);
  }

  return value;
}
