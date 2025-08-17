import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/providers/prisma.service';
import { User, Prisma, Role, RoleName } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: { userRoles: { include: { role: true } } },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: { userRoles: { include: { role: true } } },
    });
  }
  async findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...data,
        status: data.status || 'active',
        previousPasswords: data.previousPasswords || [],
        securityQuestions: data.securityQuestions || [],
        mfaRecoveryCodes: data.mfaRecoveryCodes || [],
      },
      include: { userRoles: { include: { role: true } } },
    });
  }

  async update(userId: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data,
      include: { userRoles: { include: { role: true } } },
    });
  }

  async assignRole(userId: string, roleName: RoleName): Promise<void> {
    const role = await this.prisma.role.findUnique({
      where: { name: roleName },
    });
    if (!role) {
      throw new NotFoundException(`Role ${roleName} not found`);
    }

    await this.prisma.userRole.create({
      data: {
        userId,
        roleId: role.id,
      },
    });
  }

  async getUserRoles(userId: string): Promise<Role[]> {
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId },
      include: { role: true },
    });
    return userRoles.map((ur) => ur.role);
  }

  async setCurrentRefreshToken(
    userId: string,
    hashedRefreshToken: string,
  ): Promise<User> {
    return this.update(userId, {
      currentHashedRefreshToken: hashedRefreshToken,
    });
  }

  async removeRefreshToken(userId: string): Promise<User> {
    return this.update(userId, { currentHashedRefreshToken: null });
  }

  async updateLoginInfo(userId: string): Promise<User> {
    return this.update(userId, {
      lastLogin: new Date(),
      loginIp: '0.0.0.0', // Replace with actual IP in production
      loginUserAgent: 'unknown', // Replace with actual user agent
    });
  }

  async incrementFailedLoginAttempts(userId: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { failedLoginAttempts: { increment: 1 } },
      include: { userRoles: { include: { role: true } } },
    });
  }

  async findAllWithResetToken(): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        passwordResetToken: { not: null },
        passwordResetExpires: { gt: new Date() },
      },
      include: { userRoles: { include: { role: true } } },
    });
  }

  async clearPasswordResetToken(userId: string): Promise<User> {
    return this.update(userId, {
      passwordResetToken: null,
      passwordResetExpires: null,
    });
  }
  async findMany(args: Prisma.UserFindManyArgs): Promise<User[]> {
    return this.prisma.user.findMany({
      ...args,
      include: { userRoles: { include: { role: true } } },
    });
  }

  async deleteManyUserRoles(where: Prisma.UserRoleWhereInput): Promise<void> {
    await this.prisma.userRole.deleteMany({ where });
  }
}
