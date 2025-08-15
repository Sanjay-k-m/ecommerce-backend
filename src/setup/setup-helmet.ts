import helmet from 'helmet';
import { INestApplication, Logger } from '@nestjs/common';
import { featuresConfig } from 'src/config';

const logger = new Logger('Helmet');

export function setupHelmet(app: INestApplication) {
  const { helmet: enableHelmet } = featuresConfig(); // boolean flag from config

  if (enableHelmet) {
    app.use(helmet());
    logger.log('Helmet security middleware enabled.');
  } else {
    logger.warn('Helmet security middleware is disabled.');
  }
}
