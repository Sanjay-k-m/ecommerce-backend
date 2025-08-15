import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig } from './config';
import { Logger } from '@nestjs/common';
import { setupApp } from './setup';

const logger = new Logger('Bootstrap');
const { port } = appConfig();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  setupApp(app);

  await app.listen(port);
  logger.log(`🚀 Server listening on http://localhost:${port}`);
}

bootstrap();
