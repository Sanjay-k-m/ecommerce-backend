import { Module } from '@nestjs/common';
import { ProductsController } from './controllers/v1/products.controller';
import { ProductsService } from './services/products.service';
import { ProductsRepository } from './repositories/products.repository';
import { PrismaService } from '../../common/providers/prisma.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository, PrismaService],
  exports: [ProductsService, ProductsRepository],
})
export class ProductsModule {}
