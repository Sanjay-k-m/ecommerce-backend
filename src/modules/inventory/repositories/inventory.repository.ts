import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/providers/prisma.service';
import { UpdateInventoryDto } from '../dto/v1';
import { Prisma } from '@prisma/client';

// Define type for Product with relations
type ProductWithRelations = Prisma.ProductGetPayload<{
  include: { category: true; subcategory: true };
}>;

@Injectable()
export class InventoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ProductWithRelations[]> {
    return this.prisma.product.findMany({
      where: { status: { not: 'deleted' } },
      include: { category: true, subcategory: true },
    });
  }

  async findOne(id: string): Promise<ProductWithRelations> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true, subcategory: true },
    });
    if (!product || product.status === 'deleted') {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(
    id: string,
    dto: UpdateInventoryDto,
  ): Promise<ProductWithRelations> {
    return this.prisma.product.update({
      where: { id },
      data: {
        quantity: dto.quantity,
        updatedAt: new Date(),
      },
      include: { category: true, subcategory: true },
    });
  }

  async logStockChange(
    id: string,
    quantity: number,
    reason?: string,
  ): Promise<void> {
    await this.prisma.$runCommandRaw({
      insert: 'StockChangeLog',
      documents: [
        {
          productId: id,
          quantity,
          reason: reason || 'Stock update',
          createdAt: new Date(),
        },
      ],
    });
  }
}
