import { INestApplication } from '@nestjs/common';
import { setupVersioning } from './setup-versioning';
import { setupCors } from './setup-cors';
import { setupSwagger } from './setup-swagger';
import { setupHelmet } from './setup-helmet';
import { setupGlobalValidation } from './setup-global-validation';
import { setupLoggingInterceptor } from './setup-logging-interceptor';
import { setupCompression } from './setup-compression';

export function setupApp(app: INestApplication) {
  setupVersioning(app);
  setupCors(app);
  setupSwagger(app);
  setupHelmet(app);
  setupGlobalValidation(app);
  setupLoggingInterceptor(app);
  setupCompression(app);
}
