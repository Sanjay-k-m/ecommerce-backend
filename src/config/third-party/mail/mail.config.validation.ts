/* eslint-disable @typescript-eslint/no-unsafe-return */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Joi from 'joi';

export interface MailEnvConfig {
  MAIL_HOST: string;
  MAIL_PORT: number;
  MAIL_SECURE: boolean;
  MAIL_USER: string;
  MAIL_PASS: string;
  MAIL_FROM: string;
}

const mailEnvSchema = Joi.object({
  MAIL_HOST: Joi.string().hostname().default('smtp.gmail.com'),
  MAIL_PORT: Joi.number().port().default(587),
  MAIL_SECURE: Joi.boolean().truthy('true').falsy('false').default(false),
  MAIL_USER: Joi.string().allow('').required(),
  MAIL_PASS: Joi.string().allow('').required(),
  MAIL_FROM: Joi.string().email().default('test@gmail.com'),
}).unknown(true);

export function mailValidateEnv(env: NodeJS.ProcessEnv): MailEnvConfig {
  const { error, value } = mailEnvSchema.validate(env, {
    abortEarly: false,
    convert: true,
  });

  if (error) {
    throw new Error(`Mail config validation error: ${error.message}`);
  }

  return value;
}
