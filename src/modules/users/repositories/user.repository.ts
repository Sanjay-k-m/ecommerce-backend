import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/providers/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Find a user by email */
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  /** Find a user by ID */
  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  /** Create a new user */
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  /** Update a user by ID */
  async update(userId: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({ where: { id: userId }, data });
  }

  /** Find users by password reset token (only valid tokens) */
  async findByResetToken(token: string): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        passwordResetToken: token,
        passwordResetExpires: { gt: new Date() },
      },
    });
  }

  /** Clear password reset token */
  async clearPasswordResetToken(userId: string): Promise<User> {
    return this.update(userId, {
      passwordResetToken: null,
      passwordResetExpires: null,
    });
  }
  async findAllWithResetToken(): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        passwordResetToken: { not: null },
        passwordResetExpires: { gt: new Date() },
      },
    });
  }
}
