// src/setup/setup-versioning.ts
import { INestApplication, Logger } from '@nestjs/common';
import { versioningConfig } from 'src/config';

const logger = new Logger('Versioning');

export function setupVersioning(app: INestApplication) {
  const config = versioningConfig();
  app.enableVersioning({
    type: config.type,
    defaultVersion: config.defaultVersion,
  });
  logger.log(
    `Versioning enabled (type: ${config.type}, default: ${config.defaultVersion})`,
  );
}
