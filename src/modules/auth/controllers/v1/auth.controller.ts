import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from '../../services/auth.service';
import { JwtAuthGuard } from 'src/common/security/guards/jwt-auth.guard';
import { AuthenticatedUser } from 'src/modules/auth/interfaces/auth.interface';
import {
  LoginDto,
  LoginResponseDto,
  RefreshTokenDto,
  RegisterDto,
  RequestPasswordResetDto,
  ResetPasswordDto,
  VerifyOtpDto,
} from '../../dto/v1';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { LoginResponse } from '../../interfaces/auth-response.interface';

@ApiTags('auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthControllerV1 {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Request user registration OTP' })
  @ApiResponse({
    status: 200,
    description: 'OTP sent to email for verification',
  })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  @Post('register-request')
  async registerRequest(
    @Body() dto: RegisterDto,
  ): Promise<{ message: string }> {
    await this.authService.registerRequest(dto.email, dto.password);
    return {
      message:
        'OTP sent to your email. Please verify to complete registration.',
    };
  }

  @ApiOperation({ summary: 'Verify OTP and complete registration' })
  @ApiResponse({
    status: 200,
    description: 'Registration completed successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  @Post('register-verify')
  async registerVerify(@Body() dto: VerifyOtpDto): Promise<object> {
    return await this.authService.verifyOtpAndRegister(dto.email, dto.otp);
  }

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'Returns access and refresh tokens',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post('login')
  async login(@Body() dto: LoginDto): Promise<LoginResponse> {
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
  async logout(
    @Req() req: { user: AuthenticatedUser },
  ): Promise<{ message: string }> {
    await this.authService.logout(req.user.userId);
    return { message: 'Logged out successfully' };
  }

  @ApiOperation({ summary: 'Refresh JWT tokens' })
  @ApiResponse({
    status: 200,
    description: 'Returns new access and refresh tokens',
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  @Post('refresh')
  async refresh(
    @Body() dto: RefreshTokenDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    return this.authService.refreshTokens(dto.userId, dto.refreshToken);
  }

  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent if user exists',
  })
  @Post('request-password-reset')
  async requestPasswordReset(
    @Body() dto: RequestPasswordResetDto,
  ): Promise<{ message: string }> {
    await this.authService.requestPasswordReset(dto.email);
    return {
      message: 'If the email is registered, a reset link will be sent.',
    };
  }

  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  @Post('reset-password')
  async resetPassword(
    @Body() dto: ResetPasswordDto,
  ): Promise<{ status: string; message: string }> {
    await this.authService.resetPassword(dto.token, dto.newPassword);
    return { status: 'success', message: 'Password reset successful.' };
  }
}
