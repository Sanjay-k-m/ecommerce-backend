/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { registerAs } from '@nestjs/config';
import {
  storageValidateEnv,
  StorageEnvConfig,
} from './storage.config.validation';

const validatedEnv: StorageEnvConfig = storageValidateEnv(process.env);

export default registerAs('storage', () => ({
  driver: validatedEnv.STORAGE_DRIVER,
  local: {
    path: validatedEnv.LOCAL_STORAGE_PATH,
  },
  s3: {
    accessKeyId: validatedEnv.AWS_ACCESS_KEY_ID,
    secretAccessKey: validatedEnv.AWS_SECRET_ACCESS_KEY,
    region: validatedEnv.AWS_REGION,
    bucket: validatedEnv.AWS_S3_BUCKET,
  },
  multer: {
    image: {
      maxFileSize: validatedEnv.MULTER_IMAGE_MAX,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    },
    video: {
      maxFileSize: validatedEnv.MULTER_VIDEO_MAX,
      allowedMimeTypes: ['video/mp4', 'video/webm'],
    },
  },
}));
