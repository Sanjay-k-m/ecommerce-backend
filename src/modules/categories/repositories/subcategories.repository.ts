import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/providers/prisma.service';
import { CreateSubcategoryDto } from '../dto/v1/create-subcategory.dto';
import { UpdateSubcategoryDto } from '../dto/v1/update-subcategory.dto';

@Injectable()
export class SubcategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(categoryId: string, createSubcategoryDto: CreateSubcategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return this.prisma.subcategory.create({
      data: {
        ...createSubcategoryDto,
        categoryId,
      },
    });
  }

  async findOne(id: string) {
    const subcategory = await this.prisma.subcategory.findUnique({
      where: { id },
    });
    if (!subcategory) {
      throw new NotFoundException('Subcategory not found');
    }
    return subcategory;
  }

  async update(id: string, updateSubcategoryDto: UpdateSubcategoryDto) {
    await this.findOne(id);
    return this.prisma.subcategory.update({
      where: { id },
      data: updateSubcategoryDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.subcategory.delete({
      where: { id },
    });
  }
}
