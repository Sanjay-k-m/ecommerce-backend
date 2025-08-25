import { ApiResponse } from 'src/interfaces/interface';
import { AuthTokens } from './auth.interface';

export type LoginResponse = ApiResponse<{ tokens: AuthTokens }>;
export type RefreshTokenResponse = ApiResponse<{
  tokens: AuthTokens;
}>;
export type RegisterConfirmationResponse = ApiResponse<{ tokens?: AuthTokens }>;
export type RegisterInitiationResponse = ApiResponse<{ message: string }>;
export type ForgotPasswordInitiationResponse = ApiResponse<{ message: string }>;
export type ForgotPasswordConfirmationResponse = ApiResponse<{
  message: string;
}>;

// export type TwoFactorSetupResponse = ApiResponse<{ secret?: string }>;
