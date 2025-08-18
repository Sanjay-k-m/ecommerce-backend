import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/common/providers/prisma.service';
import { CreatePaymentDto } from '../dto/v1';
import { PaymentStatus, Prisma } from '@prisma/client';

@Injectable()
export class PaymentsRepository {
  private readonly logger = new Logger(PaymentsRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(
    dto: CreatePaymentDto,
    amount: number,
    transactionId: string | undefined,
    status: PaymentStatus,
  ): Promise<Prisma.PromiseReturnType<typeof this.prisma.payment.create>> {
    this.logger.debug(`Creating payment for orderId: ${dto.orderId}`);
    const payment = await this.prisma.payment.create({
      data: {
        orderId: dto.orderId,
        amount,
        status,
        method: dto.method,
        // transactionId,
      },
      include: { order: true },
    });
    this.logger.debug(`Created payment with ID: ${payment.id}`);
    return payment;
  }

  async findAll(
    userId: string,
  ): Promise<Prisma.PromiseReturnType<typeof this.prisma.payment.findMany>> {
    this.logger.debug(`Fetching payments for userId: ${userId}`);
    const payments = await this.prisma.payment.findMany({
      where: { order: { userId } },
      include: { order: true },
    });
    this.logger.debug(
      `Found ${payments.length} payments for userId: ${userId}`,
    );
    return payments;
  }

  async findOne(
    id: string,
  ): Promise<Prisma.PromiseReturnType<typeof this.prisma.payment.findUnique>> {
    this.logger.debug(`Fetching payment ID: ${id}`);
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: { order: true },
    });
    if (!payment) {
      this.logger.warn(`Payment ID: ${id} not found`);
      throw new NotFoundException('Payment not found');
    }
    return payment;
  }

  async updateStatus(
    id: string,
    status: PaymentStatus,
  ): Promise<Prisma.PromiseReturnType<typeof this.prisma.payment.update>> {
    this.logger.debug(`Updating payment ID: ${id} to status: ${status}`);
    const payment = await this.prisma.payment.update({
      where: { id },
      data: { status, updatedAt: new Date() },
      include: { order: true },
    });
    return payment;
  }
}
