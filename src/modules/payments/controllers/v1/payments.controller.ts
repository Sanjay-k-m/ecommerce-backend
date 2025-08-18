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
import { PaymentsService } from '../../services/payments.service';
import { CreatePaymentDto, PaymentIdParamDto } from '../../dto/v1';
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
import { UserId } from 'src/common/security/decorators';
import { UpdatePaymentStatusDto } from '../../dto/v1/update-payment.dto';

@ApiTags('Payments')
@Controller({ path: 'payments', version: '1' })
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new payment for an order (Authenticated User)',
  })
  @ApiResponse({ status: 201, description: 'Payment created' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiNotFoundResponse({ description: 'Order not found' })
  async create(@UserId() userId: string, @Body() dto: CreatePaymentDto) {
    return this.service.create(userId, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all payments for authenticated user' })
  @ApiResponse({ status: 200, description: 'List of payments' })
  async findAll(@UserId() userId: string) {
    return this.service.findAll(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a single payment by ID (Authenticated User)' })
  @ApiResponse({ status: 200, description: 'Payment details' })
  @ApiNotFoundResponse({ description: 'Payment not found' })
  async findOne(@UserId() userId: string, @Param() params: PaymentIdParamDto) {
    return this.service.findOne(userId, params.id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update payment status (Admin)' })
  @ApiResponse({ status: 200, description: 'Payment status updated' })
  @ApiBadRequestResponse({ description: 'Invalid status' })
  @ApiNotFoundResponse({ description: 'Payment not found' })
  async updateStatus(
    @Param() params: PaymentIdParamDto,
    @Body() dto: UpdatePaymentStatusDto,
  ) {
    return this.service.updateStatus(params.id, dto.status);
  }
}
