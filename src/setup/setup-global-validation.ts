// src/setup/setup-global-validation.ts
import { INestApplication, Logger } from '@nestjs/common';
import { featuresConfig } from 'src/config';
import { GlobalValidationPipe } from 'src/common/pipes/global-validation.pipe';

const logger = new Logger('GlobalValidationPipe');

export function setupGlobalValidation(app: INestApplication) {
  const { globalValidationPipe } = featuresConfig();

  if (globalValidationPipe) {
    app.useGlobalPipes(GlobalValidationPipe);
    logger.log('GlobalValidationPipe enabled');
  } else {
    logger.warn('GlobalValidationPipe disabled');
  }
}
