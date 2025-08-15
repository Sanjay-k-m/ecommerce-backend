// src/setup/setup-cors.ts
import { INestApplication, Logger } from '@nestjs/common';
import { corsConfig } from 'src/config';

const logger = new Logger('CORS');

export function setupCors(app: INestApplication) {
  const config = corsConfig();
  app.enableCors(config);
  logger.log(`CORS configured with origins: ${JSON.stringify(config.origin)}`);
}
