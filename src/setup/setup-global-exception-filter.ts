import { INestApplication } from '@nestjs/common';
import { AllExceptionsFilter } from 'src/filters/all-exceptions.filter';

export function setupGlobalExceptionFilter(app: INestApplication) {
  app.useGlobalFilters(new AllExceptionsFilter());
}
