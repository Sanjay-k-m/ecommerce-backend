import { VersioningType } from '@nestjs/common';
import {
  versioningValidateEnv,
  VersioningEnvConfig,
} from './versioning.config.validation';

const validatedEnv: VersioningEnvConfig = versioningValidateEnv(process.env);

export const versioningConfig = () => ({
  type: VersioningType.URI as const,
  defaultVersion: validatedEnv.API_DEFAULT_VERSION,
});
