import { Module } from '@nestjs/common';
import { AddressesController } from './controllers/v1';
import { AddressesService } from './services/addresses.service';
import { AddressesRepository } from './repositories/addresses.repository';
import { PrismaService } from 'src/common/providers/prisma.service';

@Module({
  controllers: [AddressesController],
  providers: [AddressesService, AddressesRepository, PrismaService],
  exports: [AddressesService],
})
export class AddressesModule {}
