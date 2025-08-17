import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { CartRepository } from '../repositories/cart.repository';
import { AddToCartDto, UpdateCartItemDto } from '../dto/v1';
import {
  ProductStatus,
  CategoryStatus,
  UserStatus,
  Prisma,
} from '@prisma/client';

type CartWithRelations = Prisma.CartGetPayload<{
  include: {
    product: { include: { category: true; subcategory: true } };
    // user: true;
  };
}>;

@Injectable()
export class CartService {
  constructor(private readonly repo: CartRepository) {}

  async findAll(userId: string): Promise<CartWithRelations[]> {
    const user = await this.repo.findUser(userId);
    if (user.status !== UserStatus.active) {
      throw new ForbiddenException('User account is not active');
    }

    return this.repo.findAll(userId, {
      where: {
        product: {
          status: { not: ProductStatus.deleted },
          category: { status: { not: CategoryStatus.deleted } },
          subcategory: { status: { not: CategoryStatus.deleted } },
        },
      },
    });
  }

  async findAllForAdmin(userId: string): Promise<CartWithRelations[]> {
    const user = await this.repo.findUser(userId);
    if (user.status === UserStatus.deleted) {
      throw new NotFoundException('User not found');
    }

    return this.repo.findAll(userId, {
      where: {
        product: {
          status: { not: ProductStatus.deleted },
          category: { status: { not: CategoryStatus.deleted } },
          subcategory: { status: { not: CategoryStatus.deleted } },
        },
      },
    });
  }

  async addToCart(
    userId: string,
    dto: AddToCartDto,
  ): Promise<CartWithRelations> {
    const user = await this.repo.findUser(userId);
    if (user.status !== UserStatus.active) {
      throw new ForbiddenException('User account is not active');
    }

    const product = await this.repo.findProduct(dto.productId);
    if (
      product.status === ProductStatus.deleted ||
      product.category.status === CategoryStatus.deleted ||
      (product.subcategory &&
        product.subcategory.status === CategoryStatus.deleted)
    ) {
      throw new NotFoundException('Product not found or unavailable');
    }

    if (dto.quantity > product.quantity) {
      throw new BadRequestException(
        'Requested quantity exceeds available stock',
      );
    }

    const existingCartItem = await this.repo.findAll(userId, {
      where: { productId: dto.productId },
    });

    if (existingCartItem.length > 0) {
      throw new BadRequestException('Product already exists in cart');
    }

    return this.repo.addToCart(userId, dto);
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateCartItemDto,
  ): Promise<CartWithRelations> {
    const user = await this.repo.findUser(userId);
    if (user.status !== UserStatus.active) {
      throw new ForbiddenException('User account is not active');
    }

    const cartItem = await this.repo.findOne(id, userId);
    if (
      cartItem.product.status === ProductStatus.deleted ||
      cartItem.product.category.status === CategoryStatus.deleted ||
      (cartItem.product.subcategory &&
        cartItem.product.subcategory.status === CategoryStatus.deleted)
    ) {
      throw new NotFoundException('Product not found or unavailable');
    }

    if (dto.quantity && dto.quantity > cartItem.product.quantity) {
      throw new BadRequestException(
        'Requested quantity exceeds available stock',
      );
    }

    if (dto.quantity === 0) {
      await this.repo.remove(id, userId);
      throw new BadRequestException(
        'Quantity set to 0, item removed from cart',
      );
    }

    return this.repo.update(id, userId, dto);
  }

  async remove(userId: string, id: string): Promise<void> {
    const user = await this.repo.findUser(userId);
    if (user.status !== UserStatus.active) {
      throw new ForbiddenException('User account is not active');
    }

    await this.repo.findOne(id, userId); // Ensure item exists and belongs to user
    await this.repo.remove(id, userId);
  }

  async clearCart(userId: string): Promise<void> {
    const user = await this.repo.findUser(userId);
    if (user.status !== UserStatus.active) {
      throw new ForbiddenException('User account is not active');
    }

    await this.repo.clearCart(userId);
  }
}
