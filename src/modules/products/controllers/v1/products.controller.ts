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
import { ProductsService } from '../../services/products.service';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductSubcategoryIdParamDto,
  ProductWithIdParamDto,
} from '../../dto/v1';
import { JwtAuthGuard } from 'src/common/security/guards/jwt-auth.guard';
import { Roles } from 'src/common/security/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/common/security/guards/roles.guard';

@ApiTags('Products')
@Controller({ path: 'subcategories/:subcategoryId/products', version: '1' })
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  // ----------- PUBLIC GET -----------

  @Get()
  @ApiOperation({ summary: 'List all active products for a subcategory' })
  @ApiResponse({ status: 200, description: 'List of products' })
  async findAll(@Param() params: ProductSubcategoryIdParamDto) {
    return this.service.findAll(params.subcategoryId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single product by ID' })
  @ApiResponse({ status: 200, description: 'Product details' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  async findOne(@Param() params: ProductWithIdParamDto) {
    return this.service.findOne(params.subcategoryId, params.id);
  }

  // ----------- ADMIN OPERATIONS -----------

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product (Admin)' })
  @ApiResponse({ status: 201, description: 'Product created' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(
    @Param() params: ProductSubcategoryIdParamDto,
    @Body() dto: CreateProductDto,
  ) {
    return this.service.create(params.subcategoryId, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product by ID (Admin)' })
  @ApiResponse({ status: 200, description: 'Product updated' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param() params: ProductWithIdParamDto,
    @Body() dto: UpdateProductDto,
  ) {
    return this.service.update(params.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a product (Admin)' })
  @ApiResponse({ status: 204, description: 'Product deleted' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async remove(@Param() params: ProductWithIdParamDto) {
    return this.service.remove(params.id);
  }

  @Patch(':id/deactivate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate a product (Admin)' })
  @ApiResponse({ status: 200, description: 'Product deactivated' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async deactivate(@Param() params: ProductWithIdParamDto) {
    return this.service.deactivate(params.id);
  }

  @Patch(':id/activate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activate a product (Admin)' })
  @ApiResponse({ status: 200, description: 'Product activated' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async activate(@Param() params: ProductWithIdParamDto) {
    return this.service.activate(params.id);
  }
}
