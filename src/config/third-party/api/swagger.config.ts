import {
  swaggerValidateEnv,
  SwaggerEnvConfig,
} from './swagger.config.validation';

const validatedEnv: SwaggerEnvConfig = swaggerValidateEnv(process.env);

export const swaggerConfig = () => {
  return {
    enabled: validatedEnv.ENABLE_SWAGGER,
    title: 'NEST API',
    description: 'API docs for nest backend',
    version: '1.0',
    path: 'api-docs',
  };
};
