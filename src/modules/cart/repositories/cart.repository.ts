import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/providers/prisma.service';
import { AddToCartDto, UpdateCartItemDto } from '../dto/v1';
import { Prisma, User } from '@prisma/client';

type CartWithRelations = Prisma.CartGetPayload<{
  include: {
    product: { include: { category: true; subcategory: true } };
    // user: true;
  };
}>;

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: { category: true; subcategory: true };
}>;

@Injectable()
export class CartRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    userId: string,
    args: Prisma.CartFindManyArgs = {},
  ): Promise<CartWithRelations[]> {
    return this.prisma.cart.findMany({
      ...args,
      where: { ...args.where, userId },
      include: {
        product: { include: { category: true, subcategory: true } },
        // user: true,
      },
    });
  }

  async findOne(id: string, userId: string): Promise<CartWithRelations> {
    const cartItem = await this.prisma.cart.findFirst({
      where: { id, userId },
      include: {
        product: { include: { category: true, subcategory: true } },
        // user: true,
      },
    });
    if (!cartItem) {
      throw new NotFoundException('Cart item not found or not owned by user');
    }
    return cartItem;
  }

  async addToCart(
    userId: string,
    dto: AddToCartDto,
  ): Promise<CartWithRelations> {
    return this.prisma.cart.create({
      data: {
        userId,
        productId: dto.productId,
        quantity: dto.quantity,
      },
      include: {
        product: { include: { category: true, subcategory: true } },
        // user: true,
      },
    });
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateCartItemDto,
  ): Promise<CartWithRelations> {
    return this.prisma.cart.update({
      where: { id, userId },
      data: { quantity: dto.quantity },
      include: {
        product: { include: { category: true, subcategory: true } },
        // user: true,
      },
    });
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.prisma.cart.delete({
      where: { id, userId },
    });
  }

  async clearCart(userId: string): Promise<void> {
    await this.prisma.cart.deleteMany({
      where: { userId },
    });
  }

  async findProduct(id: string): Promise<ProductWithRelations> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true, subcategory: true },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async findUser(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
