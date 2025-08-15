import { CompressionOptions } from 'compression';
import { Request, Response } from 'express';
import {
  CompressionEnvConfig,
  compressionValidateEnv,
} from './compression.config.validation';

export interface CompressionConfig extends CompressionOptions {
  threshold?: number;
  filter?: (req: Request, res: Response) => boolean;
  zlib: {
    level: number;
  };
}

const validatedEnv: CompressionEnvConfig = compressionValidateEnv(process.env);

export const compressionConfig = (): CompressionConfig => ({
  threshold: validatedEnv.COMPRESSION_THRESHOLD,
  filter: (req: Request) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return true;
  },
  zlib: {
    level: validatedEnv.COMPRESSION_LEVEL,
  },
});
