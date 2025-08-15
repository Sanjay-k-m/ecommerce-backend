export interface User {
  id: number;
  email: string;
  password: string;
  roles: string[];
  currentHashedRefreshToken?: string | null;
  passwordResetToken?: string | null;
  passwordResetExpires?: number | null;
  isEmailVerified?: boolean;
}
