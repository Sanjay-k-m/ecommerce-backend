import {
  Controller,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SubcategoriesService } from '../../services/subcategories.service';
import { CreateSubcategoryDto } from '../../dto/v1/create-subcategory.dto';
import { UpdateSubcategoryDto } from '../../dto/v1/update-subcategory.dto';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/security/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/security/guards/roles.guard';
import { Roles } from 'src/common/security/decorators/roles.decorator';

@ApiTags('Subcategories')
@Controller('categories/:categoryId/subcategories')
export class SubcategoriesController {
  constructor(private readonly subcategoriesService: SubcategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new subcategory under a category (Admin)',
  })
  @ApiResponse({ status: 201, description: 'Subcategory created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async create(
    @Param('categoryId') categoryId: string,
    @Body() createSubcategoryDto: CreateSubcategoryDto,
  ) {
    return this.subcategoriesService.create(categoryId, createSubcategoryDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a subcategory by ID (Admin)' })
  @ApiResponse({ status: 200, description: 'Subcategory updated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Subcategory not found' })
  async update(
    @Param('id') id: string,
    @Body() updateSubcategoryDto: UpdateSubcategoryDto,
  ) {
    return this.subcategoriesService.update(id, updateSubcategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a subcategory by ID (Admin)' })
  @ApiResponse({ status: 204, description: 'Subcategory deleted successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Subcategory not found' })
  async remove(@Param('id') id: string) {
    return this.subcategoriesService.remove(id);
  }
}
