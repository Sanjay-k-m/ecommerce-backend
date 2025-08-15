/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    this.logger.debug('JwtAuthGuard: Checking authentication');
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err) {
      this.logger.error(`Auth error: ${err.message || err}`, err.stack);
      throw err;
    }

    if (!user) {
      const message = info?.message || 'Unauthorized';
      this.logger.warn(`Unauthorized access: ${message}`);

      // Log request info for more debugging context
      const request = context.switchToHttp().getRequest();
      this.logger.warn(`Request URL: ${request.url}`);
      this.logger.warn(
        `Authorization Header: ${request.headers.authorization || 'none'}`,
      );

      throw new UnauthorizedException(message);
    }

    this.logger.debug(`User authenticated: ${JSON.stringify(user)}`);
    return user;
  }
}
