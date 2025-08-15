// src/setup/setup-logging-interceptor.ts
import { INestApplication, Logger } from '@nestjs/common';
import { featuresConfig } from 'src/config';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';

const logger = new Logger('LoggingInterceptor');

export function setupLoggingInterceptor(app: INestApplication) {
  const { loggingInterceptor } = featuresConfig();

  if (loggingInterceptor) {
    app.useGlobalInterceptors(new LoggingInterceptor());
    logger.log('LoggingInterceptor enabled');
  } else {
    logger.warn('LoggingInterceptor disabled');
  }
}
