import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UsersService } from '../../users/users.service';
import { User, RoleName } from '@prisma/client';
import { JwtPayload } from '../../../interfaces/auth.interface';
import { MailService } from 'src/common/providers/mail-provider.service';
import { appConfig, jwtConfig } from 'src/config';

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

  async verifyOtpAndRegister(email: string, otp: string): Promise<void> {
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
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user || user.status !== 'active') return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await this.usersService.incrementFailedLoginAttempts(user.id);
      return null;
    }

    await this.usersService.updateUser(user.id, { failedLoginAttempts: 0 });
    // eslint-disable-next-line prettier/prettier, @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;
    return result;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const userRoles = await this.usersService.getUserRoles(user.id);
    const roleNames = userRoles.map((role) => role.name);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: roleNames,
    };

    const access_token = this.jwtService.sign(payload, {
      secret: jwtConfig().accessToken.secret,
      expiresIn: jwtConfig().accessToken.expiresIn,
    });

    const refresh_token = this.generateRefreshToken(user);
    const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);
    await this.usersService.setCurrentRefreshToken(user.id, hashedRefreshToken);
    await this.usersService.updateLoginInfo(user.id);

    return { access_token, refresh_token };
  }

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

  async logout(userId: string): Promise<void> {
    await this.usersService.removeRefreshToken(userId);
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.currentHashedRefreshToken || user.status !== 'active')
      throw new UnauthorizedException('Invalid user or session');

    const isRefreshTokenValid = await bcrypt.compare(
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

    const access_token = this.jwtService.sign(payload, {
      secret: jwtConfig().accessToken.secret,
      expiresIn: jwtConfig().accessToken.expiresIn,
    });

    const new_refresh_token = this.generateRefreshToken(user);
    const hashedNewRefreshToken = await bcrypt.hash(new_refresh_token, 10);
    await this.usersService.setCurrentRefreshToken(
      user.id,
      hashedNewRefreshToken,
    );

    return { access_token, refresh_token: new_refresh_token };
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    if (!user || user.status !== 'active') return;

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = await bcrypt.hash(resetToken, 10);
    const expiry = new Date(Date.now() + 3600 * 1000);

    await this.usersService.setPasswordResetToken(
      user.id,
      hashedResetToken,
      expiry,
    );

    const { frontendUrl } = appConfig();
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;
    await this.mailService.sendMail(
      user.email,
      'Password Reset Request',
      `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
       <p>This link will expire in 1 hour.</p>`,
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
