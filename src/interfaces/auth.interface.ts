export interface JwtPayload {
  sub: string; // or number if user.id is a number
  email: string;
  roles: string[];
}

export interface AuthenticatedUser {
  userId: string;
  email: string;
  roles: string[];
}
