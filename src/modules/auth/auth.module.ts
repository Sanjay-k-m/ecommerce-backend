import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './services/auth.service';
import { JwtStrategy } from 'src/common/security/strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { ServicesModule } from 'src/common/providers/providers.module';
import { jwtConfig } from 'src/config';
import { UsersService } from '../users/users.service';
import { PrismaService } from 'src/common/providers/prisma.service';
import { AuthControllerV1 } from './controllers/v1';
import { AuthControllerV2 } from './controllers/v2';
@Module({
  imports: [
    UsersModule,
    PassportModule,
    ServicesModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], // ensure ConfigModule is imported here
      useFactory: () => {
        const { accessToken } = jwtConfig();

        return {
          secret: accessToken.secret,
          signOptions: { expiresIn: accessToken.expiresIn },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthControllerV1, AuthControllerV2],
  providers: [AuthService, JwtStrategy, UsersService, PrismaService],
  exports: [AuthService],
})
export class AuthModule {}
