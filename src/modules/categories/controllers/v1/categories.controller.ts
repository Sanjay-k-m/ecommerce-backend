import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CategoriesService } from '../../services/categories.service';
import { CreateCategoryDto } from '../../dto/v1/create-category.dto';
import { UpdateCategoryDto } from '../../dto/v1/update-category.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/common/security/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/security/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/security/guards/roles.guard';
import { CategoryIdParamDto } from '../../dto/v1';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'List all categories with subcategories' })
  @ApiResponse({
    status: 200,
    description: 'List of categories with subcategories',
  })
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new category (Admin)' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a category by ID (Admin)' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async update(
    @Param() params: CategoryIdParamDto,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(params.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a category by ID (Admin)' })
  @ApiResponse({ status: 204, description: 'Category deleted successfully' })
  async remove(@Param() params: CategoryIdParamDto) {
    await this.categoriesService.remove(params.id);
  }

  @Patch(':id/deactivate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate a category by ID (Admin)' })
  async deactivate(@Param() params: CategoryIdParamDto) {
    return this.categoriesService.deactivate(params.id);
  }

  @Patch(':id/activate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activate a category by ID (Admin)' })
  async activate(@Param() params: CategoryIdParamDto) {
    return this.categoriesService.activate(params.id);
  }
}
