import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from 'src/common/providers/prisma.service';
import { UserRepository } from './repositories/user.repository';

@Module({
  providers: [UsersService, UserRepository, PrismaService],
  exports: [UsersService, UserRepository],
})
export class UsersModule {}
