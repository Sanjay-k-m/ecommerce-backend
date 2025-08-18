import { Module } from '@nestjs/common';
import { PaymentsController } from './controllers/v1/payments.controller';
import { PaymentsService } from './services/payments.service';
import { PaymentsRepository } from './repositories/payments.repository';
import { PrismaService } from 'src/common/providers/prisma.service';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentsRepository, PrismaService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
