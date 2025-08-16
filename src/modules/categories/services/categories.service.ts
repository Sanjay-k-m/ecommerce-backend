import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoriesRepository } from '../repositories/categories.repository';
import { CreateCategoryDto } from '../dto/v1/create-category.dto';
import { UpdateCategoryDto } from '../dto/v1/update-category.dto';
import { Prisma, CategoryStatus } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private readonly repo: CategoriesRepository) {}

  async findAll() {
    // Exclude deleted by default
    return this.repo.findAll({
      where: { status: { not: CategoryStatus.deleted } },
    });
  }

  async create(dto: CreateCategoryDto) {
    try {
      return await this.repo.create(dto);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Category with this name already exists');
      }
      throw error;
    }
  }

  async findOne(id: string) {
    const category = await this.repo.findOne(id);

    if (!category || category.status === CategoryStatus.deleted) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id); // validate exists & not deleted
    try {
      return await this.repo.update(id, dto);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Category with this name already exists');
        }
        if (error.code === 'P2025') {
          throw new NotFoundException(`Category with ID "${id}" not found`);
        }
      }
      throw error;
    }
  }

  async remove(id: string) {
    const category = await this.findOne(id);

    if (category.status === CategoryStatus.deleted) {
      throw new ConflictException('Category already deleted');
    }
    return this.repo.softDelete(id);
  }

  async deactivate(id: string) {
    const category = await this.findOne(id);
    if (category.status === CategoryStatus.deleted) {
      throw new ConflictException('Cannot deactivate a deleted category');
    }
    return this.repo.update(id, { status: CategoryStatus.inactive });
  }

  async activate(id: string) {
    const category = await this.findOne(id);
    if (category.status === CategoryStatus.deleted) {
      throw new ConflictException('Cannot activate a deleted category');
    }
    return this.repo.update(id, { status: CategoryStatus.active });
  }
}
