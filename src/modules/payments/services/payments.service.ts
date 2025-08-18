import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PaymentsRepository } from '../repositories/payments.repository';
import { CreatePaymentDto } from '../dto/v1';
import { OrderStatus, PaymentStatus, Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/providers/prisma.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly repo: PaymentsRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(
    userId: string,
    dto: CreatePaymentDto,
  ): Promise<Prisma.PromiseReturnType<typeof this.prisma.payment.create>> {
    this.logger.debug(
      `Creating payment for userId: ${userId}, orderId: ${dto.orderId}`,
    );

    // Validate order exists and belongs to user
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId, deletedAt: { equals: null } },
      include: { payment: true },
    });
    if (!order || order.userId !== userId) {
      throw new NotFoundException('Order not found or does not belong to user');
    }
    if (order.payment) {
      throw new BadRequestException('Order already has a payment');
    }
    if (order.status !== OrderStatus.pending) {
      throw new BadRequestException('Only pending orders can be paid');
    }

    // Mock payment processing
    let transactionId: string | undefined;
    let paymentStatus: PaymentStatus = PaymentStatus.pending;
    if (dto.method === 'mock') {
      transactionId = `mock_txn_${dto.orderId}`;
      paymentStatus = PaymentStatus.completed;
    } else if (dto.method === 'cod') {
      transactionId = undefined;
      paymentStatus = PaymentStatus.pending;
    }

    // Create payment
    const payment = await this.repo.create(
      dto,
      order.total,
      transactionId,
      paymentStatus,
    );
    this.logger.debug(`Created payment with ID: ${payment.id}`);

    // Update order status for mock payments
    if (dto.method === 'mock') {
      await this.prisma.order.update({
        where: { id: dto.orderId },
        data: { status: OrderStatus.confirmed, updatedAt: new Date() },
      });
      this.logger.debug(`Updated order ${dto.orderId} to confirmed`);
    }

    return payment;
  }

  async findAll(
    userId: string,
  ): Promise<Prisma.PromiseReturnType<typeof this.prisma.payment.findMany>> {
    this.logger.debug(`Fetching payments for userId: ${userId}`);
    const payments = await this.repo.findAll(userId);
    this.logger.debug(
      `Found ${payments.length} payments for userId: ${userId}`,
    );
    return payments;
  }

  async findOne(
    userId: string,
    id: string,
  ): Promise<Prisma.PromiseReturnType<typeof this.prisma.payment.findUnique>> {
    this.logger.debug(`Fetching payment ID: ${id} for userId: ${userId}`);
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: { order: true },
    });
    if (!payment || !payment.order || payment.order.userId !== userId) {
      throw new NotFoundException('Payment not found');
    }
    return payment;
  }

  async updateStatus(
    id: string,
    status: string,
  ): Promise<Prisma.PromiseReturnType<typeof this.prisma.payment.update>> {
    this.logger.debug(`Updating payment ID: ${id} to status: ${status}`);
    if (!Object.values(PaymentStatus).includes(status as PaymentStatus)) {
      throw new BadRequestException('Invalid payment status');
    }
    const payment = await this.repo.findOne(id);
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    if (
      payment.status === PaymentStatus.completed ||
      payment.status === PaymentStatus.refunded
    ) {
      throw new BadRequestException(
        'Cannot update status of completed or refunded payment',
      );
    }
    return this.repo.updateStatus(id, status as PaymentStatus);
  }
}
