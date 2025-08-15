import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthenticatedUser } from 'src/interfaces/auth.interface';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  RegisterDto,
  VerifyOtpDto,
  RequestPasswordResetDto,
} from '../../dto/v1';
import { JwtAuthGuard } from 'src/common/security/guards/jwt-auth.guard';

@ApiTags('auth')
@Controller({
  path: 'auth',
  version: '2',
})
export class AuthControllerV2 {
  @Post('register-request')
  registerRequest(@Body() dto: RegisterDto) {
    return { message: `(v2 dummy) OTP would be sent to email ${dto.email}` };
  }

  @Post('register-verify')
  registerVerify(@Body() dto: VerifyOtpDto) {
    return { message: `(v2 dummy) Registration verified for ${dto.email}` };
  }

  @Post('login')
  login() {
    return {
      access_token: 'dummy-access-token-v2',
      refresh_token: 'dummy-refresh-token-v2',
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Req() req: { user: AuthenticatedUser }) {
    return { message: `(v2 dummy) User ${req.user.userId} logged out` };
  }

  @Post('refresh')
  refresh() {
    return {
      access_token: 'new-dummy-access-token-v2',
      refresh_token: 'new-dummy-refresh-token-v2',
    };
  }

  @Post('request-password-reset')
  requestPasswordReset(@Body() dto: RequestPasswordResetDto) {
    return {
      message: `(v2 dummy) If the email ${dto.email} is registered, reset link will be sent.`,
    };
  }

  @Post('reset-password')
  resetPassword() {
    return { message: `(v2 dummy) Password reset successful.` };
  }
}
