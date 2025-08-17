import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { ProductsRepository } from '../repositories/products.repository';
import { CreateProductDto, UpdateProductDto } from '../dto/v1';
import { ProductStatus, CategoryStatus, Prisma } from '@prisma/client';

// Define type for Product with relations
type ProductWithRelations = Prisma.ProductGetPayload<{
  include: { category: true; subcategory: true };
}>;

@Injectable()
export class ProductsService {
  constructor(private readonly repo: ProductsRepository) {}

  async findAll(subcategoryId: string): Promise<ProductWithRelations[]> {
    // Validate subcategory exists and is not deleted
    const subcategory = await this.repo.findSubcategory(subcategoryId);
    if (!subcategory || subcategory.status === 'deleted') {
      throw new NotFoundException('Subcategory not found or deleted');
    }
    // Validate category is not deleted
    const category = await this.repo.findCategory(subcategory.categoryId);
    if (!category || category.status === CategoryStatus.deleted) {
      throw new NotFoundException('Category not found or deleted');
    }
    return this.repo.findAll({
      where: {
        subcategoryId,
        status: { not: ProductStatus.deleted },
        category: { status: { not: CategoryStatus.deleted } },
      },
    });
  }

  async findOne(
    subcategoryId: string,
    id: string,
  ): Promise<ProductWithRelations> {
    const product = await this.repo.findOne(id);
    if (
      !product ||
      product.status === ProductStatus.deleted ||
      product.subcategoryId !== subcategoryId ||
      product.category.status === CategoryStatus.deleted
    ) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async create(
    subcategoryId: string,
    dto: CreateProductDto,
  ): Promise<ProductWithRelations> {
    // Validate subcategory exists and is not deleted
    const subcategory = await this.repo.findSubcategory(subcategoryId);
    if (!subcategory || subcategory.status === 'deleted') {
      throw new BadRequestException('Subcategory not found or deleted');
    }
    // Validate category is not deleted
    const category = await this.repo.findCategory(subcategory.categoryId);
    if (!category || category.status === CategoryStatus.deleted) {
      throw new BadRequestException('Category not found or deleted');
    }

    // Check for existing product with same name in subcategory
    const existing = await this.repo.findAll({
      where: {
        subcategoryId,
        name: dto.name,
        status: { not: ProductStatus.deleted },
      },
    });
    if (existing.length) {
      throw new ConflictException(
        'Product with this name already exists in the subcategory',
      );
    }

    return this.repo.create(subcategoryId, dto);
  }

  async update(
    id: string,
    dto: UpdateProductDto,
  ): Promise<ProductWithRelations> {
    const product = await this.repo.findOne(id);
    if (
      !product ||
      product.status === ProductStatus.deleted ||
      product.category.status === CategoryStatus.deleted
    ) {
      throw new NotFoundException('Product not found');
    }

    // Check for name conflict if name is updated
    if (dto.name && dto.name !== product.name) {
      const existing = await this.repo.findAll({
        where: {
          subcategoryId: product.subcategoryId,
          name: dto.name,
          NOT: { id },
          status: { not: ProductStatus.deleted },
        },
      });
      if (existing.length) {
        throw new ConflictException(
          'Product with this name already exists in the subcategory',
        );
      }
    }

    return this.repo.update(id, dto);
  }

  async remove(id: string): Promise<void> {
    const product = await this.repo.findOne(id);
    if (
      !product ||
      product.status === ProductStatus.deleted ||
      product.category.status === CategoryStatus.deleted
    ) {
      throw new NotFoundException('Product not found');
    }
    await this.repo.softDelete(id);
  }

  async deactivate(id: string): Promise<ProductWithRelations> {
    const product = await this.repo.findOne(id);
    if (
      !product ||
      product.status === ProductStatus.deleted ||
      product.category.status === CategoryStatus.deleted
    ) {
      throw new NotFoundException('Product not found');
    }
    return this.repo.update(id, { status: ProductStatus.inactive });
  }

  async activate(id: string): Promise<ProductWithRelations> {
    const product = await this.repo.findOne(id);
    if (
      !product ||
      product.status === ProductStatus.deleted ||
      product.category.status === CategoryStatus.deleted
    ) {
      throw new NotFoundException('Product not found');
    }
    return this.repo.update(id, { status: ProductStatus.active });
  }
}
