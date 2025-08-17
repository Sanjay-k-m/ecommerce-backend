import { Module } from '@nestjs/common';
import { CartController } from './controllers/v1/cart.controller';
import { CartService } from './services/cart.service';
import { CartRepository } from './repositories/cart.repository';
import { PrismaService } from '../../common/providers/prisma.service';

@Module({
  controllers: [CartController],
  providers: [CartService, CartRepository, PrismaService],
  exports: [CartService, CartRepository],
})
export class CartModule {}
