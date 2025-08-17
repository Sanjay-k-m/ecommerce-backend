import { Module } from '@nestjs/common';
import { InventoryController } from './controllers/v1/inventory.controller';
import { InventoryService } from './services/inventory.service';
import { InventoryRepository } from './repositories/inventory.repository';
import { PrismaService } from 'src/common/providers/prisma.service';

@Module({
  controllers: [InventoryController],
  providers: [InventoryService, InventoryRepository, PrismaService],
  exports: [InventoryService],
})
export class InventoryModule {}
