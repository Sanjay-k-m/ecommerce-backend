// src/setup/setup-swagger.ts
import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from 'src/config';

const logger = new Logger('Swagger');

export function setupSwagger(app: INestApplication) {
  const config = swaggerConfig();

  if (config.enabled) {
    const swaggerDocConfig = new DocumentBuilder()
      .setTitle(config.title)
      .setDescription(config.description)
      .setVersion(config.version)
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerDocConfig);
    SwaggerModule.setup(config.path, app, document);

    logger.log(`Swagger enabled at /${config.path}`);
  } else {
    logger.warn('Swagger disabled');
  }
}
