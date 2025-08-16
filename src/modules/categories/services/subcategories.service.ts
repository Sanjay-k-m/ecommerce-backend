import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { SubcategoriesRepository } from '../repositories/subcategories.repository';
import { CreateSubcategoryDto } from '../dto/v1/create-subcategory.dto';
import { UpdateSubcategoryDto } from '../dto/v1/update-subcategory.dto';
import { CategoryStatus } from '@prisma/client';

@Injectable()
export class SubcategoriesService {
  constructor(private readonly repo: SubcategoriesRepository) {}

  async findAll(categoryId: string) {
    return this.repo.findAll({
      where: { categoryId, status: { not: CategoryStatus.deleted } },
    });
  }

  async findOne(categoryId: string, id: string) {
    const subcategory = await this.repo.findOne(id);
    if (
      subcategory.categoryId !== categoryId ||
      subcategory.status === CategoryStatus.deleted
    ) {
      throw new NotFoundException('Subcategory not found');
    }
    return subcategory;
  }

  async create(categoryId: string, dto: CreateSubcategoryDto) {
    const existing = await this.repo.findAll({
      where: {
        categoryId,
        name: dto.name,
        status: { not: CategoryStatus.deleted },
      },
    });

    if (existing.length)
      throw new ConflictException('Subcategory with this name already exists');

    return this.repo.create(categoryId, dto);
  }

  async update(id: string, dto: UpdateSubcategoryDto) {
    const subcategory = await this.repo.findOne(id);

    if (subcategory.status === CategoryStatus.deleted) {
      throw new ConflictException('Cannot update deleted subcategory');
    }

    if (dto.name) {
      const existing = await this.repo.findAll({
        where: {
          categoryId: subcategory.categoryId,
          name: dto.name,
          NOT: { id },
          status: { not: CategoryStatus.deleted },
        },
      });
      if (existing.length)
        throw new ConflictException(
          'Subcategory with this name already exists',
        );
    }

    return this.repo.update(id, dto);
  }

  async remove(id: string) {
    const subcategory = await this.repo.findOne(id);
    if (subcategory.status === CategoryStatus.deleted) {
      throw new ConflictException('Subcategory already deleted');
    }
    return this.repo.softDelete(id);
  }

  async deactivate(id: string) {
    const subcategory = await this.repo.findOne(id);
    if (subcategory.status === CategoryStatus.deleted) {
      throw new ConflictException('Cannot deactivate deleted subcategory');
    }
    return this.repo.update(id, { status: CategoryStatus.inactive });
  }

  async activate(id: string) {
    const subcategory = await this.repo.findOne(id);
    if (subcategory.status === CategoryStatus.deleted) {
      throw new ConflictException('Cannot activate deleted subcategory');
    }
    return this.repo.update(id, { status: CategoryStatus.active });
  }
}
