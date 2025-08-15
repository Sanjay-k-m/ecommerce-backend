import {
  featuresValidateEnv,
  FeaturesEnvConfig,
} from './features.config.validation';

const validatedEnv: FeaturesEnvConfig = featuresValidateEnv(process.env);
const nodeEnv = process.env.NODE_ENV || 'development';

export const featuresConfig = () => {
  // Base flags from env validation
  const baseFeatures = {
    helmet: validatedEnv.ENABLE_HELMET,
    swagger: validatedEnv.ENABLE_SWAGGER,
    loggingInterceptor: validatedEnv.ENABLE_LOGGING_INTERCEPTOR,
    globalValidationPipe: validatedEnv.ENABLE_GLOBAL_VALIDATION_PIPE,
    compression: validatedEnv.COMPRESSION_ENABLED,
    throttle: validatedEnv.ENABLE_THROTTLE,
  };

  // Override flags per NODE_ENV
  switch (nodeEnv) {
    case 'production':
      return {
        ...baseFeatures,
        swagger: false, // Force disable Swagger in prod
        throttle: true, // Force enable throttle in prod
      };
    case 'test':
      return {
        helmet: false,
        swagger: false,
        loggingInterceptor: false,
        globalValidationPipe: false,
        compression: false,
        throttle: false,
      };
    case 'development':
    default:
      return baseFeatures; // Use env flags as-is for dev and others
  }
};
