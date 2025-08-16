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
import { SubcategoriesService } from '../../services/subcategories.service';
import { Roles } from 'src/common/security/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/security/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/security/guards/roles.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import {
  CreateSubcategoryDto,
  SubcategoryCategoryIdParamDto,
  SubcategoryWithIdParamDto,
  UpdateSubcategoryDto,
} from '../../dto/v1';
@ApiTags('Subcategories')
@Controller('categories/:categoryId/subcategories')
export class SubcategoriesController {
  constructor(private readonly service: SubcategoriesService) {}

  // ----------- PUBLIC GET -----------

  @Get()
  @ApiOperation({ summary: 'List all subcategories for a category' })
  @ApiResponse({ status: 200, description: 'List of subcategories' })
  async findAll(@Param() params: SubcategoryCategoryIdParamDto) {
    return this.service.findAll(params.categoryId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single subcategory by ID' })
  @ApiResponse({ status: 200, description: 'Subcategory details' })
  @ApiResponse({ status: 404, description: 'Subcategory not found' })
  async findOne(@Param() params: SubcategoryWithIdParamDto) {
    return this.service.findOne(params.categoryId, params.id);
  }

  // ----------- ADMIN OPERATIONS -----------

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new subcategory (Admin)' })
  @ApiResponse({ status: 201, description: 'Subcategory created' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async create(
    @Param() params: SubcategoryCategoryIdParamDto,
    @Body() dto: CreateSubcategoryDto,
  ) {
    return this.service.create(params.categoryId, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a subcategory by ID (Admin)' })
  @ApiResponse({ status: 200, description: 'Subcategory updated' })
  async update(
    @Param() params: SubcategoryWithIdParamDto,
    @Body() dto: UpdateSubcategoryDto,
  ) {
    return this.service.update(params.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a subcategory (Admin)' })
  @ApiResponse({ status: 204, description: 'Subcategory deleted' })
  async remove(@Param() params: SubcategoryWithIdParamDto) {
    return this.service.remove(params.id);
  }

  @Patch(':id/deactivate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate a subcategory (Admin)' })
  async deactivate(@Param() params: SubcategoryWithIdParamDto) {
    return this.service.deactivate(params.id);
  }

  @Patch(':id/activate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activate a subcategory (Admin)' })
  async activate(@Param() params: SubcategoryWithIdParamDto) {
    return this.service.activate(params.id);
  }
}
