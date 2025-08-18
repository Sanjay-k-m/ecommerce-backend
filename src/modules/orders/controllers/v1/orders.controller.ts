import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from '../../services/orders.service';
import {
  CreateOrderDto,
  OrderIdParamDto,
  UpdateOrderStatusDto,
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
import { UserId } from 'src/common/security/decorators';

@ApiTags('Orders')
@Controller({ path: 'orders', version: '1' })
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new order from cart (Authenticated User)',
  })
  @ApiResponse({ status: 201, description: 'Order created' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(@UserId() userId: string, @Body() dto: CreateOrderDto) {
    return this.service.create(userId, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all orders for authenticated user' })
  @ApiResponse({ status: 200, description: 'List of orders' })
  async findAll(@UserId() userId: string) {
    return this.service.findAll(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a single order by ID (Authenticated User)' })
  @ApiResponse({ status: 200, description: 'Order details' })
  @ApiNotFoundResponse({ description: 'Order not found' })
  async findOne(@UserId() userId: string, @Param() params: OrderIdParamDto) {
    return this.service.findOne(userId, params.id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update order status (Admin)' })
  @ApiResponse({ status: 200, description: 'Order status updated' })
  @ApiBadRequestResponse({ description: 'Invalid status' })
  @ApiNotFoundResponse({ description: 'Order not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async updateStatus(
    @Param() params: OrderIdParamDto,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.service.updateStatus(params.id, dto.status);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel an order (Authenticated User)' })
  @ApiResponse({ status: 200, description: 'Order cancelled' })
  @ApiNotFoundResponse({ description: 'Order not found' })
  @ApiBadRequestResponse({ description: 'Order cannot be cancelled' })
  async cancel(@UserId() userId: string, @Param() params: OrderIdParamDto) {
    return this.service.cancel(userId, params.id);
  }
}
