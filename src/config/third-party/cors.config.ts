import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { corsValidateEnv, CorsEnvConfig } from './cors.config.validation';

const validatedEnv: CorsEnvConfig = corsValidateEnv(process.env);

export const corsConfig = (): CorsOptions => {
  const origins = validatedEnv.CORS_ORIGIN.split(',').map((origin) =>
    origin.trim(),
  );

  return {
    origin: origins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };
};
