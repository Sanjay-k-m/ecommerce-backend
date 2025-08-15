/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { UsersService } from '../../users/users.service';
import { User } from '@prisma/client';
import { JwtPayload } from '../../../interfaces/auth.interface';
import { MailService } from 'src/common/providers/mail-provider.service';
import { appConfig, jwtConfig } from 'src/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  /** Register new user with OTP (stored in DB temporarily) */
  /** Register new user with OTP (supports unverified user updates) */
  async registerRequest(email: string, password: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    if (user && user.isEmailVerified) {
      // Fully registered & verified
      throw new ConflictException('Email already registered');
    }

    if (user && !user.isEmailVerified) {
      // User exists but not verified → update OTP & password
      await this.usersService.updateUser(user.id, {
        otp: hashedOtp,
        otpExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 min
        password,
      });
    } else {
      // New user → create
      await this.usersService.createUser({
        email,
        password,
        roles: ['user'],
        isEmailVerified: false,
        otp: hashedOtp,
        otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
      });
    }

    // Send OTP email
    await this.mailService.sendMail(email, 'OTP for registration', otp);
  }

  /** Verify OTP and activate user */
  async verifyOtpAndRegister(email: string, otp: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new BadRequestException('No pending registration');

    if (!user.otp || !user.otpExpiry || user.otpExpiry < new Date())
      throw new BadRequestException('OTP expired');

    const isValidOtp = await bcrypt.compare(otp, user.otp);
    if (!isValidOtp) throw new BadRequestException('Invalid OTP');

    // Mark user as verified and remove OTP fields
    await this.usersService.updateUser(user.id, {
      isEmailVerified: true,
      otp: null,
      otpExpiry: null,
    });
  }

  /** Validate user credentials */
  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    const { password: _, ...result } = user;
    return result;
  }

  /** Login user and return JWT tokens */
  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    const access_token = this.jwtService.sign(payload, {
      secret: jwtConfig().accessToken.secret,
      expiresIn: jwtConfig().accessToken.expiresIn,
    });

    const refresh_token = this.generateRefreshToken(user);
    await this.usersService.setCurrentRefreshToken(user.id, refresh_token);
    await this.usersService.updateLoginInfo(user.id);

    return { access_token, refresh_token };
  }

  /** Generate JWT refresh token */
  generateRefreshToken(user: Omit<User, 'password'>): string {
    const { refreshToken } = jwtConfig();
    return this.jwtService.sign(
      { sub: user.id },
      {
        secret: refreshToken.secret,
        expiresIn: refreshToken.expiresIn,
      },
    );
  }

  /** Logout user by clearing refresh token */
  async logout(userId: string): Promise<void> {
    await this.usersService.removeRefreshToken(userId);
  }

  /** Refresh tokens if refresh token is valid */
  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.currentHashedRefreshToken)
      throw new UnauthorizedException();

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );
    if (!isRefreshTokenValid) throw new UnauthorizedException();

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    const access_token = this.jwtService.sign(payload, {
      secret: jwtConfig().accessToken.secret,
      expiresIn: jwtConfig().accessToken.expiresIn,
    });

    const new_refresh_token = this.generateRefreshToken(user);
    await this.usersService.setCurrentRefreshToken(user.id, new_refresh_token);

    return { access_token, refresh_token: new_refresh_token };
  }

  /** Request password reset */
  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return; // silently ignore

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = await bcrypt.hash(resetToken, 10);
    const expiry = new Date(Date.now() + 3600 * 1000).getTime();
    await this.usersService.setPasswordResetToken(
      user.id,
      hashedResetToken,
      expiry,
    );
    console.log('refresh token for user:', user.id, resetToken);
    const { frontendUrl } = appConfig();
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;
    await this.mailService.sendMail(
      user.email,
      'Password Reset Request',
      `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
       <p>This link will expire in 1 hour.</p>`,
    );
  }

  /** Reset password using token */
  async resetPassword(token: string, newPassword: string) {
    // Find user(s) by matching hashed reset token
    const users = await this.usersService.findByResetToken(token);
    if (!users.length)
      throw new BadRequestException('Invalid or expired token');

    const user = users[0];
    console.log('Resetting password for user:', user.id);

    await this.usersService.updatePassword(user.id, newPassword);
    await this.usersService.clearPasswordResetToken(user.id);
  }
}
