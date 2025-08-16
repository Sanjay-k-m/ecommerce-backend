import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/providers/prisma.service';
import { Prisma, Category } from '@prisma/client';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(args?: Prisma.CategoryFindManyArgs): Promise<Category[]> {
    return this.prisma.category.findMany({
      include: { subcategories: true },
      ...args,
    });
  }

  async create(data: Prisma.CategoryCreateInput): Promise<Category> {
    return this.prisma.category.create({ data });
  }

  async findOne(id: string): Promise<Category | null> {
    return this.prisma.category.findUnique({ where: { id } });
  }

  async update(
    id: string,
    data: Prisma.CategoryUpdateInput,
  ): Promise<Category> {
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string): Promise<Category> {
    return this.prisma.category.update({
      where: { id },
      data: { status: 'deleted', deletedAt: new Date() },
    });
  }

  async hardDelete(id: string): Promise<Category> {
    return this.prisma.category.delete({ where: { id } });
  }
}
