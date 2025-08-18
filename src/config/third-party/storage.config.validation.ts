/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Joi from 'joi';

export interface StorageEnvConfig {
  STORAGE_DRIVER: 'local' | 's3';
  LOCAL_STORAGE_PATH?: string;
  AWS_ACCESS_KEY_ID?: string;
  AWS_SECRET_ACCESS_KEY?: string;
  AWS_REGION?: string;
  AWS_S3_BUCKET?: string;
  MULTER_IMAGE_MAX: number;
  MULTER_VIDEO_MAX: number;
}

const storageEnvSchema = Joi.object({
  STORAGE_DRIVER: Joi.string().valid('local', 's3').default('local'),
  LOCAL_STORAGE_PATH: Joi.string().default('./uploads'),
  AWS_ACCESS_KEY_ID: Joi.string().when('STORAGE_DRIVER', {
    is: 's3',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  AWS_SECRET_ACCESS_KEY: Joi.string().when('STORAGE_DRIVER', {
    is: 's3',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  AWS_REGION: Joi.string().default('ap-south-1'),
  AWS_S3_BUCKET: Joi.string().when('STORAGE_DRIVER', {
    is: 's3',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  MULTER_IMAGE_MAX: Joi.number().default(5 * 1024 * 1024), // 5MB
  MULTER_VIDEO_MAX: Joi.number().default(200 * 1024 * 1024), // 200MB
}).unknown(true);

export function storageValidateEnv(env: NodeJS.ProcessEnv): StorageEnvConfig {
  const { error, value } = storageEnvSchema.validate(env, {
    abortEarly: false,
    convert: true,
  });

  if (error) {
    throw new Error(`Storage config validation error: ${error.message}`);
  }

  return value;
}
