import { Module } from '@nestjs/common';
import { OrdersController } from './controllers/v1/orders.controller';
import { OrdersService } from './services/orders.service';
import { OrdersRepository } from './repositories/orders.repository';
import { PrismaService } from 'src/common/providers/prisma.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository, PrismaService],
  exports: [OrdersService],
})
export class OrdersModule {}
