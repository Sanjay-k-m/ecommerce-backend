import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let res: any = {
      message: 'Internal server error',
      statusCode: status,
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      res = exception.getResponse();
    }

    response.status(status).json({
      ...res, // keep everything NestJS puts
      status: 'error', // just add this
    });
  }
}
