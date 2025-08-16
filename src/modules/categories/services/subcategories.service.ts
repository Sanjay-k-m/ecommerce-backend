import { Injectable } from '@nestjs/common';
import { SubcategoriesRepository } from '../repositories/subcategories.repository';
import { CreateSubcategoryDto } from '../dto/v1/create-subcategory.dto';
import { UpdateSubcategoryDto } from '../dto/v1/update-subcategory.dto';

@Injectable()
export class SubcategoriesService {
  constructor(
    private readonly subcategoriesRepository: SubcategoriesRepository,
  ) {}

  async create(categoryId: string, createSubcategoryDto: CreateSubcategoryDto) {
    return this.subcategoriesRepository.create(
      categoryId,
      createSubcategoryDto,
    );
  }

  async update(id: string, updateSubcategoryDto: UpdateSubcategoryDto) {
    return this.subcategoriesRepository.update(id, updateSubcategoryDto);
  }

  async remove(id: string) {
    return this.subcategoriesRepository.remove(id);
  }
}
