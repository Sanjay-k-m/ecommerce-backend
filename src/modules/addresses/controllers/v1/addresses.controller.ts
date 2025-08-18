import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AddressesService } from '../../services/addresses.service';
import {
  CreateAddressDto,
  UpdateAddressDto,
  AddressIdParamDto,
} from '../../dto/v1';
import { JwtAuthGuard } from 'src/common/security/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { UserId } from 'src/common/security/decorators';

@ApiTags('Addresses')
@Controller({ path: 'addresses', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AddressesController {
  constructor(private readonly service: AddressesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new address' })
  @ApiResponse({ status: 201, description: 'Address created' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async create(@UserId() userId: string, @Body() dto: CreateAddressDto) {
    return this.service.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all user addresses' })
  @ApiResponse({ status: 200, description: 'List of addresses' })
  async findAll(@UserId() userId: string) {
    return this.service.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an address by ID' })
  @ApiResponse({ status: 200, description: 'Address details' })
  @ApiNotFoundResponse({ description: 'Address not found' })
  async findOne(@UserId() userId: string, @Param() params: AddressIdParamDto) {
    return this.service.findOne(userId, params.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an address' })
  @ApiResponse({ status: 200, description: 'Address updated' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiNotFoundResponse({ description: 'Address not found' })
  async update(
    @UserId() userId: string,
    @Param() params: AddressIdParamDto,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.service.update(userId, params.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete an address' })
  @ApiResponse({ status: 204, description: 'Address deleted' })
  @ApiNotFoundResponse({ description: 'Address not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@UserId() userId: string, @Param() params: AddressIdParamDto) {
    await this.service.delete(userId, params.id);
  }
}
