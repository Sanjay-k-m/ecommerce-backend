import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/providers/prisma.service';
import { CreateOrderDto } from '../dto/v1';
import { OrderStatus, Prisma } from '@prisma/client';

type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    items: { include: { product: true } };
    //  user: true
  };
}>;

@Injectable()
export class OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateOrderDto, total: number) {
    return this.prisma.order.create({
      data: {
        userId,
        total,
        status: OrderStatus.pending,
        deletedAt: null,
        items: {
          create: dto.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: 0, // Set in service after fetching product
          })),
        },
      },
      include: {
        items: { include: { product: true } },
        // user: true
      },
    });
  }

  async findAll(userId: string): Promise<OrderWithRelations[]> {
    console.log(userId);
    return this.prisma.order.findMany({
      where: { userId, deletedAt: null },
      include: {
        items: { include: { product: true } },
        //  user: true
      },
    });
  }

  async findOne(id: string): Promise<OrderWithRelations> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        //  user: true
      },
    });
    if (!order || order.deletedAt)
      throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(
    id: string,
    status: OrderStatus,
  ): Promise<OrderWithRelations> {
    return this.prisma.order.update({
      where: { id },
      data: { status, updatedAt: new Date() },
      include: {
        items: { include: { product: true } },
        //  user: true
      },
    });
  }

  async cancel(id: string): Promise<OrderWithRelations> {
    return this.prisma.order.update({
      where: { id },
      data: { status: OrderStatus.cancelled, updatedAt: new Date() },
      include: {
        items: { include: { product: true } },
        // user: true
      },
    });
  }

  async updateStock(productId: string, quantity: number) {
    return this.prisma.product.update({
      where: { id: productId },
      data: { quantity: { decrement: quantity } },
    });
  }
}
