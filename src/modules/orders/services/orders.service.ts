import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { OrdersRepository } from '../repositories/orders.repository';
import { CreateOrderDto } from '../dto/v1';
import { OrderStatus, Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/providers/prisma.service';

type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    items: { include: { product: true } };
    //  user: true
  };
}>;

@Injectable()
export class OrdersService {
  constructor(
    private readonly repo: OrdersRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(
    userId: string,
    dto: CreateOrderDto,
  ): Promise<OrderWithRelations> {
    // Validate products and calculate total
    let total = 0;
    for (const item of dto.items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });
      if (!product || product.status !== 'active' || product.deletedAt) {
        throw new NotFoundException(
          `Product ${item.productId} not found or inactive`,
        );
      }
      if (product.quantity < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${item.productId}`,
        );
      }
      total += product.price * item.quantity;
    }

    // Create order
    const order = await this.repo.create(userId, dto, total);

    // Update order items with correct prices
    for (const item of dto.items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });
      if (product) {
        await this.prisma.orderItem.updateMany({
          where: { orderId: order.id, productId: item.productId },
          data: { price: product.price },
        });
      }
    }

    // Update stock
    for (const item of dto.items) {
      await this.prisma.product.update({
        where: { id: item.productId },
        data: { quantity: { decrement: item.quantity } },
      });
    }

    // Clear cart
    await this.prisma.cart.deleteMany({
      where: { userId },
    });

    return order;
  }

  async findAll(userId: string): Promise<OrderWithRelations[]> {
    return this.repo.findAll(userId);
  }

  async findOne(userId: string, id: string): Promise<OrderWithRelations> {
    const order = await this.repo.findOne(id);
    if (order.userId !== userId) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async updateStatus(id: string, status: string): Promise<OrderWithRelations> {
    if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
      throw new BadRequestException('Invalid order status');
    }
    const order = await this.repo.findOne(id);
    if (
      order.status === OrderStatus.cancelled ||
      order.status === OrderStatus.refunded
    ) {
      throw new BadRequestException(
        'Cannot update status of cancelled or refunded order',
      );
    }
    return this.repo.updateStatus(id, status as OrderStatus);
  }

  async cancel(userId: string, id: string): Promise<OrderWithRelations> {
    const order = await this.repo.findOne(id);
    if (order.userId !== userId) {
      throw new NotFoundException('Order not found');
    }
    if (order.status !== OrderStatus.pending) {
      throw new BadRequestException('Only pending orders can be cancelled');
    }
    return this.repo.cancel(id);
  }
}
