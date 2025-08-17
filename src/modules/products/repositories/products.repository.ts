import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/providers/prisma.service';
import { CreateProductDto, UpdateProductDto } from '../dto/v1';
import { Category, Subcategory, Prisma } from '@prisma/client';

// Define type for Product with relations
type ProductWithRelations = Prisma.ProductGetPayload<{
  include: { category: true; subcategory: true };
}>;

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    args?: Prisma.ProductFindManyArgs,
  ): Promise<ProductWithRelations[]> {
    return this.prisma.product.findMany({
      ...args,
      include: { category: true, subcategory: true },
    });
  }

  async findOne(id: string): Promise<ProductWithRelations> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true, subcategory: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findSubcategory(id: string): Promise<Subcategory> {
    const subcategory = await this.prisma.subcategory.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!subcategory) throw new NotFoundException('Subcategory not found');
    return subcategory;
  }

  async findCategory(id: string): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async create(
    subcategoryId: string,
    dto: CreateProductDto,
  ): Promise<ProductWithRelations> {
    const subcategory = await this.findSubcategory(subcategoryId);
    return this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        quantity: dto.quantity,
        categoryId: subcategory.categoryId,
        subcategoryId,
        status: dto.status || 'active',
      },
      include: { category: true, subcategory: true },
    });
  }

  async update(
    id: string,
    dto: UpdateProductDto,
  ): Promise<ProductWithRelations> {
    return this.prisma.product.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        quantity: dto.quantity,
        status: dto.status,
      },
      include: { category: true, subcategory: true },
    });
  }

  async softDelete(id: string): Promise<ProductWithRelations> {
    return this.prisma.product.update({
      where: { id },
      data: { status: 'deleted', deletedAt: new Date() },
      include: { category: true, subcategory: true },
    });
  }
}
