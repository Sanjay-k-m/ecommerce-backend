import { Module } from '@nestjs/common';
import { CategoriesController } from './controllers/v1/categories.controller';
import { SubcategoriesController } from './controllers/v1/subcategories.controller';
import { CategoriesService } from './services/categories.service';
import { SubcategoriesService } from './services/subcategories.service';
import { CategoriesRepository } from './repositories/categories.repository';
import { SubcategoriesRepository } from './repositories/subcategories.repository';
import { PrismaService } from '../../common/providers/prisma.service';

@Module({
  controllers: [CategoriesController, SubcategoriesController],
  providers: [
    CategoriesService,
    SubcategoriesService,
    CategoriesRepository,
    SubcategoriesRepository,
    PrismaService,
  ],
  exports: [CategoriesService, SubcategoriesService],
})
export class CategoriesModule {}
