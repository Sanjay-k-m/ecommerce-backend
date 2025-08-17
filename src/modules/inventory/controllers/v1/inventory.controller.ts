import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { InventoryService } from '../../services/inventory.service';
import { UpdateInventoryDto, ProductIdParamDto } from '../../dto/v1';
import { JwtAuthGuard } from 'src/common/security/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/security/guards/roles.guard';
import { Roles } from 'src/common/security/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

@ApiTags('Inventory')
@Controller({ path: 'inventory', version: '1' })
export class InventoryController {
  constructor(private readonly service: InventoryService) {}

  @Get()
  @ApiOperation({ summary: 'List all products with stock levels (public)' })
  @ApiResponse({ status: 200, description: 'List of products with inventory' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get stock details for a specific product (public)',
  })
  @ApiResponse({ status: 200, description: 'Product stock details' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  async findOne(@Param() params: ProductIdParamDto) {
    return this.service.findOne(params.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product stock (Admin)' })
  @ApiResponse({ status: 200, description: 'Stock updated' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param() params: ProductIdParamDto,
    @Body() dto: UpdateInventoryDto,
  ) {
    return this.service.update(params.id, dto);
  }
}
