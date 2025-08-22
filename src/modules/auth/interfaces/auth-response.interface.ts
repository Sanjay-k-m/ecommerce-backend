import { ApiResponse } from 'src/interfaces/interface';
import { AuthTokens } from './auth.interface';

export type LoginResponse = ApiResponse<{ tokens: AuthTokens }>;
export type RegisterResponse = ApiResponse<{ tokens: AuthTokens }>;
export type RefreshTokenResponse = ApiResponse<{ tokens: AuthTokens }>;
export type RequestPasswordResetResponse = ApiResponse<{ message: string }>;
export type ResetPasswordResponse = ApiResponse<{ message: string }>;
// export type TwoFactorResponse = ApiResponse<{ secret?: string }>;
// export type VerifyOtpResponse = ApiResponse<{ tokens?: AuthTokens }>;
