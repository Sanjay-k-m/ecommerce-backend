import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './repositories/user.repository';
import { Prisma, User, RoleName } from '@prisma/client';
import { UpdateProfileDto, UpdateRoleDto } from './dto/v1';

@Injectable()
export class UsersService {
  private readonly passwordHistoryLimit = 5;

  constructor(private readonly userRepo: UserRepository) {}

  async createUser(data: Prisma.UserCreateInput) {
    const existing = await this.userRepo.findByEmail(data.email);
    if (existing) throw new BadRequestException('Email already in use');

    // Hash password once
    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;

      // Also store it in previousPasswords
      data.previousPasswords = [hashedPassword];
    }

    return this.userRepo.create(data);
  }

  async findByEmail(email: string) {
    return this.userRepo.findByEmail(email);
  }

  async findById(id: string) {
    return this.userRepo.findById(id);
  }

  async setCurrentRefreshToken(userId: string, refreshToken: string) {
    return this.userRepo.setCurrentRefreshToken(userId, refreshToken);
  }

  async removeRefreshToken(userId: string) {
    return this.userRepo.removeRefreshToken(userId);
  }

  async updatePassword(userId: string, newPassword: string) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const previous = Array.isArray(user.previousPasswords)
      ? user.previousPasswords
      : [];

    for (const hash of previous) {
      if (typeof hash === 'string' && hash) {
        const isMatch = await bcrypt.compare(newPassword, hash);
        if (isMatch) {
          throw new BadRequestException('Cannot reuse previous password');
        }
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    previous.push(hashedPassword);
    if (previous.length > this.passwordHistoryLimit) previous.shift();

    return this.userRepo.update(userId, {
      password: hashedPassword,
      previousPasswords: previous,
      lastPasswordChange: new Date(),
    });
  }

  async setPasswordResetToken(userId: string, token: string, expiry: Date) {
    return this.userRepo.update(userId, {
      passwordResetToken: token,
      passwordResetExpires: expiry,
    });
  }

  async softDelete(userId: string) {
    return this.userRepo.update(userId, {
      deletedAt: new Date(),
      status: 'deleted',
    });
  }

  async updateLoginInfo(userId: string, ip?: string, userAgent?: string) {
    return this.userRepo.update(userId, {
      lastLogin: new Date(),
      loginIp: ip || '0.0.0.0',
      loginUserAgent: userAgent || 'unknown',
    });
  }

  async setTwoFactor(userId: string, enabled: boolean, secret?: string) {
    return this.userRepo.update(userId, {
      twoFactorEnabled: enabled,
      twoFactorSecret: secret || null,
    });
  }

  async setRecoveryCodes(userId: string, codes: string[]) {
    return this.userRepo.update(userId, { mfaRecoveryCodes: codes });
  }

  async updateUser(
    userId: string,
    data: Prisma.UserUpdateInput,
  ): Promise<User> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password as string, 10);
    }
    return this.userRepo.update(userId, data);
  }

  async clearPasswordResetToken(userId: string) {
    return this.userRepo.update(userId, {
      passwordResetToken: null,
      passwordResetExpires: null,
    });
  }

  async findByResetToken(token: string): Promise<User[]> {
    const users = await this.userRepo.findAllWithResetToken();
    const matchedUsers: User[] = [];
    for (const user of users) {
      if (
        user.passwordResetToken &&
        (await bcrypt.compare(token, user.passwordResetToken))
      ) {
        matchedUsers.push(user);
      }
    }
    return matchedUsers;
  }

  async assignRole(userId: string, roleName: RoleName): Promise<void> {
    return this.userRepo.assignRole(userId, roleName);
  }

  async getUserRoles(userId: string) {
    return this.userRepo.getUserRoles(userId);
  }

  async incrementFailedLoginAttempts(userId: string) {
    return this.userRepo.incrementFailedLoginAttempts(userId);
  }

  async generateUniqueUsername(email: string): Promise<string> {
    const namePart = email.split('@')[0];
    let username: string;
    let exists: User | null;

    do {
      const randomNumber = Math.floor(Math.random() * 10000);
      username = `${namePart}${randomNumber}`;
      exists = await this.userRepo.findByUsername(username);
    } while (exists);

    return username;
  }

  // New methods for user management endpoints
  async getProfile(userId: string): Promise<User> {
    const user = await this.userRepo.findById(userId);
    if (!user || user.status === 'deleted') {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<User> {
    const user = await this.userRepo.findById(userId);
    if (!user || user.status === 'deleted') {
      throw new NotFoundException('User not found');
    }
    if (dto.username) {
      const existingUser = await this.userRepo.findByUsername(dto.username);
      if (existingUser && existingUser.id !== userId) {
        throw new BadRequestException('Username already taken');
      }
    }
    return this.userRepo.update(userId, {
      firstName: dto.firstName,
      lastName: dto.lastName,
      username: dto.username,
      dob: dto.dob ? new Date(dto.dob) : undefined,
      phone: dto.phone,
      updatedAt: new Date(),
    });
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.findMany({
      where: { status: { not: 'deleted' } },
      include: { userRoles: { include: { role: true } } },
    });
  }

  async updateRole(userId: string, dto: UpdateRoleDto): Promise<User> {
    const user = await this.userRepo.findById(userId);

    if (!user || user.status === 'deleted') {
      throw new NotFoundException('User not found');
    }

    // Clear existing roles
    await this.userRepo.deleteManyUserRoles({ userId });

    // Assign new roles
    for (const roleName of dto.roles) {
      await this.userRepo.assignRole(userId, roleName as RoleName);
    }

    // Return updated user with roles
    return (await this.userRepo.findById(userId))!;
  }
}
