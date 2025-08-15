import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ThrottlerCustomModule } from './common/throttler/throttler.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // global .env config
    ThrottlerCustomModule.forRoot(), // Our throttler module
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
