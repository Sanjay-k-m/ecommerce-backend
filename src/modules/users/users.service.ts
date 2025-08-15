/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */

import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './repositories/user.repository';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersService {
  private readonly passwordHistoryLimit = 5; // Prevent last 5 passwords reuse

  constructor(private readonly userRepo: UserRepository) {}

  /** Create new user with hashed password */
  async createUser(data: Prisma.UserCreateInput) {
    const existing = await this.userRepo.findByEmail(data.email as string);
    if (existing) throw new BadRequestException('Email already in use');

    const hashedPassword = await bcrypt.hash(data.password as string, 10);
    data.password = hashedPassword;

    // Initialize arrays for JSON fields
    data.previousPasswords = [hashedPassword];
    data.securityQuestions = [];
    data.mfaRecoveryCodes = [];

    return this.userRepo.create(data);
  }

  /** Find user by email */
  async findByEmail(email: string) {
    return this.userRepo.findByEmail(email);
  }

  /** Find user by ID */
  async findById(id: string) {
    return this.userRepo.findById(id);
  }

  /** Update refresh token (hashed) */
  async setCurrentRefreshToken(userId: string, refreshToken: string) {
    const hashed = await bcrypt.hash(refreshToken, 10);
    return this.userRepo.update(userId, { currentHashedRefreshToken: hashed });
  }

  /** Remove refresh token */
  async removeRefreshToken(userId: string) {
    return this.userRepo.update(userId, { currentHashedRefreshToken: null });
  }

  /** Update password and manage previousPasswords */
  async updatePassword(userId: string, newPassword: string) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    // Ensure previousPasswords is an array of strings
    const previous: string[] = Array.isArray(user.previousPasswords)
      ? (user.previousPasswords as string[])
      : [];

    // Prevent reuse of previous passwords
    for (const hash of previous) {
      if (await bcrypt.compare(newPassword, hash)) {
        throw new BadRequestException('Cannot reuse previous password');
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    console.log(
      '🚀 ~ UsersService ~ updatePassword ~ newPassword:',
      newPassword,
    );
    console.log(
      '🚀 ~ UsersService ~ updatePassword ~ hashedPassword:',
      hashedPassword,
    );

    // Maintain password history limit
    previous.push(hashedPassword);
    if (previous.length > this.passwordHistoryLimit) previous.shift();

    // Update the user using Prisma JSON support
    return this.userRepo.update(userId, {
      password: hashedPassword,
      previousPasswords: previous,
      lastPasswordChange: new Date(),
    });
  }

  /** Set password reset token */
  async setPasswordResetToken(userId: string, token: string, expiry: number) {
    const expiryDate = new Date(Date.now() + expiry);
    return this.userRepo.update(userId, {
      passwordResetToken: token,
      passwordResetExpires: expiryDate,
    });
  }

  /** Soft delete user */
  async softDelete(userId: string) {
    return this.userRepo.update(userId, {
      deletedAt: new Date(),
      status: 'deleted',
    });
  }

  /** Update last login info */
  async updateLoginInfo(userId: string, ip?: string, userAgent?: string) {
    return this.userRepo.update(userId, {
      lastLogin: new Date(),
      loginIp: ip,
      loginUserAgent: userAgent,
    });
  }

  /** Enable or disable 2FA */
  async setTwoFactor(userId: string, enabled: boolean, secret?: string) {
    return this.userRepo.update(userId, {
      twoFactorEnabled: enabled,
      twoFactorSecret: secret || null,
    });
  }

  /** Set MFA recovery codes */
  async setRecoveryCodes(userId: string, codes: string[]) {
    return this.userRepo.update(userId, { mfaRecoveryCodes: codes });
  }

  /**
   * Update a user with partial data
   * @param userId - User ID
   * @param data - Partial user fields to update
   */
  async updateUser(
    userId: string,
    data: Prisma.UserUpdateInput,
  ): Promise<User> {
    // Hash password if it exists in update data
    if (data.password) {
      data.password = await bcrypt.hash(data.password as string, 10);
    }

    return this.userRepo.update(userId, data);
  }
  /** Clear password reset token and expiry */
  async clearPasswordResetToken(userId: string) {
    return this.userRepo.update(userId, {
      passwordResetToken: null,
      passwordResetExpires: null,
    });
  }
  /** Find user(s) by matching hashed password reset token */
  async findByResetToken(token: string): Promise<User[]> {
    // 1. Get all users whose token exists and is not expired
    const users = await this.userRepo.findAllWithResetToken();

    // 2. Filter users whose hashed token matches
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
}
