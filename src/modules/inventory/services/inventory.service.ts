import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InventoryRepository } from '../repositories/inventory.repository';
import { UpdateInventoryDto } from '../dto/v1';
import { CategoryStatus, Prisma } from '@prisma/client';

// Define type for Product with relations
type ProductWithRelations = Prisma.ProductGetPayload<{
  include: { category: true; subcategory: true };
}>;

@Injectable()
export class InventoryService {
  constructor(private readonly repo: InventoryRepository) {}

  async findAll(): Promise<ProductWithRelations[]> {
    const products = await this.repo.findAll();
    return products.filter(
      (product) =>
        product.category.status !== CategoryStatus.deleted &&
        (!product.subcategory ||
          product.subcategory.status !== CategoryStatus.deleted),
    );
  }

  async findOne(id: string): Promise<ProductWithRelations> {
    const product = await this.repo.findOne(id);
    if (
      product.category.status === CategoryStatus.deleted ||
      (product.subcategory &&
        product.subcategory.status === CategoryStatus.deleted)
    ) {
      throw new NotFoundException(
        'Product not found or category/subcategory deleted',
      );
    }
    return product;
  }

  async update(
    id: string,
    dto: UpdateInventoryDto,
  ): Promise<ProductWithRelations> {
    const product = await this.repo.findOne(id);
    if (
      product.category.status === CategoryStatus.deleted ||
      (product.subcategory &&
        product.subcategory.status === CategoryStatus.deleted)
    ) {
      throw new BadRequestException(
        'Product not available due to category/subcategory status',
      );
    }

    if (dto.quantity !== undefined && dto.quantity < 0) {
      throw new BadRequestException('Quantity cannot be negative');
    }

    // Log stock change
    if (dto.quantity !== undefined && dto.quantity !== product.quantity) {
      await this.repo.logStockChange(id, dto.quantity, dto.reason);
    }

    return this.repo.update(id, dto);
  }
}
