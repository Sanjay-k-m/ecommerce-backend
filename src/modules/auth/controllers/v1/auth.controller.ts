// src/modules/auth/controllers/v1/auth.controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from '../../services/auth.service';
import { JwtAuthGuard } from 'src/common/security/guards/jwt-auth.guard';
import {
  LoginResponseDto,
  RegisterInitiateResponseDto,
  RegisterConfirmResponseDto,
  RefreshTokenResponseDto,
  ForgotPasswordConfirmRequestDto,
  ForgotPasswordInitiateResponseDto,
  ForgotPasswordConfirmationResponseDto,
  RegisterInitiateRequestDto,
  RegisterConfirmRequestDto,
  LoginRequestDto,
  RefreshTokensRequestDto,
  ForgotPasswordInitiateRequestDto,
} from '../../dto/v1';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import {
  ForgotPasswordConfirmationResponse,
  ForgotPasswordInitiationResponse,
  LoginResponse,
  RefreshTokenResponse,
  RegisterConfirmationResponse,
  RegisterInitiationResponse,
} from '../../interfaces/auth-response.interface';
import { BasicResponse } from 'src/interfaces/interface';
import { UserId } from 'src/common/security/decorators';

@ApiTags('auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthControllerV1 {
  constructor(private readonly authService: AuthService) {}

  // ----------------------------
  // Registration
  // ----------------------------
  @ApiOperation({ summary: 'Initiate user registration (send OTP)' })
  @ApiResponse({
    status: 200,
    description: 'OTP sent to email for verification',
    type: RegisterInitiateResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  @Post('register/initiate')
  async registerInitiate(
    @Body() dto: RegisterInitiateRequestDto,
  ): Promise<RegisterInitiationResponse> {
    await this.authService.registerInitiate(dto);
    return {
      status: 'success',
      message:
        'OTP sent to your email. Please verify to complete registration.',
    };
  }

  @ApiOperation({ summary: 'Confirm OTP and complete registration' })
  @ApiResponse({
    status: 200,
    description: 'Registration completed successfully',
    type: RegisterConfirmResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  @Post('register/confirm')
  async registerConfirm(
    @Body() dto: RegisterConfirmRequestDto,
  ): Promise<RegisterConfirmationResponse> {
    const tokens = await this.authService.registerConfirm(dto);
    return {
      status: 'success',
      message: 'Registration successful.',
      data: { tokens },
    };
  }

  // ----------------------------
  // Login / Logout
  // ----------------------------
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'Returns access and refresh tokens',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post('login')
  async login(@Body() dto: LoginRequestDto): Promise<LoginResponse> {
    const tokens = await this.authService.login(dto);
    return {
      status: 'success',
      message: 'Login successful.',
      data: { tokens },
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @Post('logout')
  async logout(@UserId() userId: string): Promise<BasicResponse> {
    await this.authService.logout(userId);
    return { status: 'success', message: 'Logged out successfully.' };
  }

  // ----------------------------
  // Token refresh
  // ----------------------------
  @ApiOperation({ summary: 'Refresh JWT tokens' })
  @ApiResponse({
    status: 200,
    description: 'Returns new access and refresh tokens',
    type: RefreshTokenResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  @Post('token/refresh')
  async refreshTokens(
    @Body() dto: RefreshTokensRequestDto,
    @UserId() userId: string,
  ): Promise<RefreshTokenResponse> {
    const tokens = await this.authService.refreshTokens(userId, dto);
    return {
      status: 'success',
      message: 'Token refresh successful.',
      data: { tokens },
    };
  }

  // ----------------------------
  // Forgot Password
  // ----------------------------
  @ApiOperation({ summary: 'Request forgot password link' })
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent if user exists',
    type: ForgotPasswordInitiateResponseDto,
  })
  @Post('forgot-password/initiate')
  async forgotPasswordInitiate(
    @Body() dto: ForgotPasswordInitiateRequestDto,
  ): Promise<ForgotPasswordInitiationResponse> {
    await this.authService.forgotPasswordInitiate(dto);
    return {
      status: 'success',
      message: 'If the email is registered, a reset link will be sent.',
    };
  }

  @ApiOperation({ summary: 'Confirm forgot password with token' })
  @ApiResponse({
    status: 200,
    description: 'Password change successful',
    type: ForgotPasswordConfirmationResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  @Post('forgot-password/confirm')
  async forgotPasswordConfirm(
    @Body() dto: ForgotPasswordConfirmRequestDto,
  ): Promise<ForgotPasswordConfirmationResponse> {
    await this.authService.forgotPasswordConfirm(dto);
    return {
      status: 'success',
      message: 'Password reset successful.',
    };
  }
}
