// src/common/modules/throttler/throttler.module.ts

import { Module, DynamicModule, Logger } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { featuresConfig, getThrottlerConfig } from 'src/config';

@Module({})
export class ThrottlerCustomModule {
  static forRoot(): DynamicModule {
    const config = getThrottlerConfig();
    const { throttle: throttleEnabled } = featuresConfig();
    const logger = new Logger('Throttler');

    if (throttleEnabled) {
      logger.log(
        `Throttler enabled (ttl: ${config.ttl}ms, limit: ${config.limit} req, blockDuration: ${config.blockDuration}ms)`,
      );
    } else {
      logger.warn('Throttler disabled');
    }

    const throttlerOptions = throttleEnabled
      ? [
          {
            ttl: config.ttl,
            limit: config.limit,
            blockDuration: config.blockDuration,
          },
        ]
      : [
          {
            ttl: 0,
            limit: 0,
          },
        ];

    return {
      module: ThrottlerCustomModule,
      imports: [ThrottlerModule.forRoot(throttlerOptions)],
      providers: [
        {
          provide: APP_GUARD,
          useClass: ThrottlerGuard,
        },
      ],
      exports: [ThrottlerModule],
    };
  }
}
