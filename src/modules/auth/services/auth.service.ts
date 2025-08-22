// src/modules/auth/auth.service.ts
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../users/users.service';
import { RoleName } from '@prisma/client';
import { AuthTokens, JwtPayload } from '../interfaces/auth.interface';
import { MailService } from 'src/common/providers/mail-provider.service';
import { appConfig } from 'src/config';
import { LoginDto } from '../dto/v1';

import {
  generateAccessToken,
  generateRefreshToken,
} from 'src/common/utils/jwt.util';

import { passwordResetTemplate } from 'src/common/mail/templates/password-reset';
import { normalizeEmail } from '../utils/email.util';
import { comparePassword } from 'src/common/utils';
import { validateUser } from '../utils/user.validator';
import { generatePasswordResetToken } from '../utils/password-reset.util';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async registerRequest(email: string, password: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    if (user && user.isEmailVerified) {
      throw new ConflictException('Email already registered');
    }

    if (user && !user.isEmailVerified) {
      await this.usersService.updateUser(user.id, {
        otp: hashedOtp,
        otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
        password, // raw password
      });
    } else {
      const username = await this.usersService.generateUniqueUsername(email);
      await this.usersService.createUser({
        email,
        password, // raw password
        isEmailVerified: false,
        otp: hashedOtp,
        otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
        status: 'active',
        username,
        previousPasswords: [], // UsersService will hash password and add here
        securityQuestions: [],
        mfaRecoveryCodes: [],
      });
    }

    await this.mailService.sendMail(
      email,
      'OTP for Registration',
      `Your OTP is: ${otp}`,
    );
  }

  async verifyOtpAndRegister(email: string, otp: string): Promise<object> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new BadRequestException('No pending registration');

    if (!user.otp || !user.otpExpiry || user.otpExpiry < new Date())
      throw new BadRequestException('OTP expired or invalid');

    const isValidOtp = await bcrypt.compare(otp, user.otp);
    if (!isValidOtp) throw new BadRequestException('Invalid OTP');

    await this.usersService.assignRole(user.id, RoleName.user);
    await this.usersService.updateUser(user.id, {
      isEmailVerified: true,
      otp: null,
      otpExpiry: null,
      status: 'active',
    });
    const userRoles = await this.usersService.getUserRoles(user.id);
    const roleNames = userRoles.map((role) => role.name);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: roleNames,
    };

    const access_token = generateAccessToken(this.jwtService, payload);
    const refresh_token = generateRefreshToken(this.jwtService, user.id);

    const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);
    await this.usersService.setCurrentRefreshToken(user.id, hashedRefreshToken);
    await this.usersService.updateLoginInfo(user.id);

    return { access_token, refresh_token };
  }

  async login(data: LoginDto): Promise<AuthTokens> {
    const user = await validateUser(
      this.usersService,
      data.email,
      data.password,
    );
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const userRoles = await this.usersService.getUserRoles(user.id);
    const roleNames = userRoles.map((role) => role.name);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: roleNames,
    };

    const access_token = generateAccessToken(this.jwtService, payload);
    const refresh_token = generateRefreshToken(this.jwtService, user.id);

    const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);
    await this.usersService.setCurrentRefreshToken(user.id, hashedRefreshToken);
    await this.usersService.updateLoginInfo(user.id);

    return { access_token, refresh_token };
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.removeRefreshToken(userId);
  }

  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<AuthTokens> {
    const user = await this.usersService.findById(userId);
    if (!user || !user.currentHashedRefreshToken || user.status !== 'active')
      throw new UnauthorizedException('Invalid user or session');

    const isRefreshTokenValid = await comparePassword(
      refreshToken,
      user.currentHashedRefreshToken,
    );
    if (!isRefreshTokenValid)
      throw new UnauthorizedException('Invalid refresh token');

    const userRoles = await this.usersService.getUserRoles(userId);
    const roleNames = userRoles.map((role) => role.name);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: roleNames,
    };

    const access_token = generateAccessToken(this.jwtService, payload);
    const new_refresh_token = generateRefreshToken(this.jwtService, user.id);

    const hashedNewRefreshToken = await bcrypt.hash(new_refresh_token, 10);
    await this.usersService.setCurrentRefreshToken(
      user.id,
      hashedNewRefreshToken,
    );

    return { access_token, refresh_token: new_refresh_token };
  }

  async requestPasswordReset(email: string): Promise<void> {
    const normalizedEmail = normalizeEmail(email);
    const user = await this.usersService.findByEmail(normalizedEmail);
    if (!user || user.status !== 'active') return;
    const { hashedResetToken, resetToken, expiry } =
      await generatePasswordResetToken();

    await this.usersService.setPasswordResetToken(
      user.id,
      hashedResetToken,
      expiry,
    );

    const { frontendUrl } = appConfig();
    const resetUrl = `${frontendUrl}/auth/otp/reset?token=${resetToken}`;

    await this.mailService.sendMail(
      user.email,
      'Password Reset Request',
      passwordResetTemplate(resetUrl),
    );
  }

  async resetPassword(token: string, newPassword: string) {
    const users = await this.usersService.findByResetToken(token);
    if (!users.length)
      throw new BadRequestException('Invalid or expired token');

    const user = users[0];
    await this.usersService.updatePassword(user.id, newPassword);
    await this.usersService.clearPasswordResetToken(user.id);
  }
}
