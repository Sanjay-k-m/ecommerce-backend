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
import { CartService } from '../../services/cart.service';
import {
  AddToCartDto,
  UpdateCartItemDto,
  CartItemIdParamDto,
} from '../../dto/v1';
import { UserId } from 'src/common/security/decorators/user-id.decorator';
import { JwtAuthGuard } from 'src/common/security/guards/jwt-auth.guard';
import { Roles } from 'src/common/security/decorators/roles.decorator';
import { RolesGuard } from 'src/common/security/guards/roles.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

@ApiTags('Cart')
@Controller({ path: 'cart', version: '1' })
export class CartController {
  constructor(private readonly service: CartService) {}

  // ----------- USER OPERATIONS -----------

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all cart items for the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of cart items' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async findAll(@UserId() userId: string) {
    return this.service.findAll(userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add an item to the cart' })
  @ApiResponse({ status: 201, description: 'Item added to cart' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiNotFoundResponse({ description: 'Product or user not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async addToCart(@UserId() userId: string, @Body() dto: AddToCartDto) {
    return this.service.addToCart(userId, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a cart item quantity' })
  @ApiResponse({ status: 200, description: 'Cart item updated' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiNotFoundResponse({ description: 'Cart item not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async update(
    @UserId() userId: string,
    @Param() params: CartItemIdParamDto,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.service.update(userId, params.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove an item from the cart' })
  @ApiResponse({ status: 204, description: 'Cart item removed' })
  @ApiNotFoundResponse({ description: 'Cart item not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async remove(@UserId() userId: string, @Param() params: CartItemIdParamDto) {
    await this.service.remove(userId, params.id);
  }

  @Delete()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Clear the entire cart' })
  @ApiResponse({ status: 204, description: 'Cart cleared' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async clearCart(@UserId() userId: string) {
    await this.service.clearCart(userId);
  }

  // ----------- ADMIN OPERATIONS -----------

  @Get('admin/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all cart items for a specific user (Admin)' })
  @ApiResponse({ status: 200, description: 'List of cart items for the user' })
  @ApiNotFoundResponse({ description: 'User or cart not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async findAllForUser(@Param('userId') userId: string) {
    return this.service.findAllForAdmin(userId);
  }
}
