import {
  throttlerValidateEnv,
  ThrottlerEnvConfig,
} from './throttler.config.validation';

const validatedEnv: ThrottlerEnvConfig = throttlerValidateEnv(process.env);

interface ThrottlerConfig {
  ttl: number;
  limit: number;
  blockDuration: number;
}

export const throttlerConfig = () => ({
  throttler: [
    {
      name: 'default',
      ttl: validatedEnv.THROTTLE_TTL_MS,
      limit: validatedEnv.THROTTLE_LIMIT,
      blockDuration: validatedEnv.THROTTLE_BLOCK_DURATION_MS,
    },
  ],
});

export const getThrottlerConfig = (): ThrottlerConfig => ({
  ttl: validatedEnv.THROTTLE_TTL_MS,
  limit: validatedEnv.THROTTLE_LIMIT,
  blockDuration: validatedEnv.THROTTLE_BLOCK_DURATION_MS,
});
