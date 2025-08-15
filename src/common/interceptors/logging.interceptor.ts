/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap, catchError } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');
  private readonly DEBUG = process.env.NODE_ENV !== 'production';

  // Fake fatal log level (prints with logger.error but extra marker)
  private fatal(message: string, trace?: string) {
    this.logger.error(`💀 FATAL: ${message}`, trace);
  }

  // Map HTTP methods to emojis
  private methodEmoji(method: string) {
    switch (method.toUpperCase()) {
      case 'POST':
        return '✍️';
      case 'PUT':
        return '✏️';
      case 'DELETE':
        return '🗑️';
      case 'PATCH':
        return '🩹';
      case 'GET':
        return '🔍';
      default:
        return '';
    }
  }

  // Map status codes to emojis
  private statusEmoji(status: number) {
    if (status >= 500) return '🔥';
    if (status >= 400) return '⚠️';
    if (status >= 300) return '🔀';
    if (status >= 200) return '✅';
    if (status >= 100) return 'ℹ️';
    return '';
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    const correlationId = (req.headers['x-correlation-id'] || uuidv4()).slice(
      0,
      8,
    );
    req.headers['x-correlation-id'] = correlationId;
    res.setHeader('x-correlation-id', correlationId);

    const { method, originalUrl: url, ip, headers, protocol } = req;
    const userAgent = (headers['user-agent'] || 'unknown').slice(0, 40);
    const startTime = Date.now();

    const initialMemKB = process.memoryUsage().heapUsed / 1024;
    const initialCPU = process.cpuUsage();

    const methodEmj = this.methodEmoji(method);
    const securedEmoji = protocol === 'https' ? '🔒' : '⚠️';

    // Info log when request starts
    this.logger.log(
      `${securedEmoji} ➡️ ${methodEmj} [${correlationId}] ${method.toUpperCase()} ${url} IP:${ip} UA:${userAgent}`,
    );

    return next.handle().pipe(
      tap(() => {
        const durationMs = Date.now() - startTime;
        const finalMemKB = process.memoryUsage().heapUsed / 1024;
        const cpuDiffMs =
          (process.cpuUsage(initialCPU).user +
            process.cpuUsage(initialCPU).system) /
          1000;

        const encoding = (res.getHeader('Content-Encoding') ||
          'none') as string;
        const size = Number(res.getHeader('Content-Length')) || 0;

        const slowEmoji = durationMs > 1000 ? '🐢' : '';
        const verySlowEmoji = durationMs > 3000 ? '🚨' : '';
        const compressedEmoji = ['gzip', 'deflate', 'br'].includes(encoding)
          ? '📦'
          : '';
        const statusEmj = this.statusEmoji(res.statusCode);

        const baseMsg =
          `[${correlationId}] ${method.toUpperCase()} ${url} ${res.statusCode} ${statusEmj} +${durationMs}ms ` +
          `MemΔ:${(finalMemKB - initialMemKB).toFixed(1)}KB CPUΔ:${cpuDiffMs.toFixed(1)}ms ` +
          `Enc:${encoding} Size:${size}B ${compressedEmoji} ${slowEmoji}${verySlowEmoji}`;

        // Use correct log level
        if (res.statusCode >= 500) {
          this.logger.error(baseMsg);
        } else if (res.statusCode >= 400) {
          this.logger.warn(baseMsg);
        } else if (durationMs > 2000) {
          this.logger.verbose(`🐢 SLOW: ${baseMsg}`);
        } else {
          this.logger.log(`⬅️ ${baseMsg}`);
        }

        // Debug headers
        if (this.DEBUG) {
          const safeHeaders = [
            'user-agent',
            'content-type',
            'content-length',
            'accept',
            'x-correlation-id',
          ];
          const filteredHeaders = Object.fromEntries(
            Object.entries(headers).filter(([k]) =>
              safeHeaders.includes(k.toLowerCase()),
            ),
          );
          this.logger.debug(`🐛 Headers: ${JSON.stringify(filteredHeaders)}`);
        }
      }),
      catchError((error) => {
        const durationMs = Date.now() - startTime;
        const finalMemKB = process.memoryUsage().heapUsed / 1024;
        const cpuDiffMs =
          (process.cpuUsage(initialCPU).user +
            process.cpuUsage(initialCPU).system) /
          1000;

        const encoding = (res.getHeader('Content-Encoding') ||
          'none') as string;
        const size = Number(res.getHeader('Content-Length')) || 0;

        const errMsg =
          `[${correlationId}] ${method.toUpperCase()} ${url} ${res.statusCode || 500} +${durationMs}ms ` +
          `MemΔ:${(finalMemKB - initialMemKB).toFixed(1)}KB CPUΔ:${cpuDiffMs.toFixed(1)}ms ` +
          `Enc:${encoding} Size:${size}B Error: ${error.message}`;

        // Fatal if uncaught exception in production
        if (process.env.NODE_ENV === 'production') {
          this.fatal(errMsg, error.stack);
        } else {
          this.logger.error(errMsg, error.stack);
        }

        // Structured JSON error log
        this.logger.error(
          JSON.stringify({
            correlationId,
            method,
            url,
            statusCode: res.statusCode || 500,
            durationMs,
            memoryDeltaKB: (finalMemKB - initialMemKB).toFixed(2),
            cpuDeltaMs: cpuDiffMs.toFixed(2),
            encoding,
            responseSizeBytes: size,
            ip,
            userAgent,
            error: error.message,
            stack: error.stack,
          }),
        );

        throw error;
      }),
    );
  }
}
