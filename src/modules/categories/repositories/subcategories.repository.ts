import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/providers/prisma.service';
import { CreateSubcategoryDto } from '../dto/v1/create-subcategory.dto';
import { UpdateSubcategoryDto } from '../dto/v1/update-subcategory.dto';
import { Subcategory, Prisma } from '@prisma/client';

@Injectable()
export class SubcategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(args?: Prisma.SubcategoryFindManyArgs): Promise<Subcategory[]> {
    return this.prisma.subcategory.findMany({ ...args });
  }

  async findOne(id: string): Promise<Subcategory> {
    const subcategory = await this.prisma.subcategory.findUnique({
      where: { id },
    });
    if (!subcategory) throw new NotFoundException('Subcategory not found');
    return subcategory;
  }

  async create(
    categoryId: string,
    dto: CreateSubcategoryDto,
  ): Promise<Subcategory> {
    return this.prisma.subcategory.create({
      data: { ...dto, categoryId },
    });
  }

  async update(id: string, dto: UpdateSubcategoryDto): Promise<Subcategory> {
    return this.prisma.subcategory.update({ where: { id }, data: dto });
  }

  async softDelete(id: string): Promise<Subcategory> {
    return this.prisma.subcategory.update({
      where: { id },
      data: { status: 'deleted', deletedAt: new Date() },
    });
  }
}
