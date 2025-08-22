import { JwtService } from '@nestjs/jwt';
import { jwtConfig } from 'src/config';

export function generateAccessToken(
  jwtService: JwtService,
  payload: object,
): string {
  return jwtService.sign(payload, {
    secret: jwtConfig().accessToken.secret,
    expiresIn: jwtConfig().accessToken.expiresIn,
  });
}

export function generateRefreshToken(
  jwtService: JwtService,
  userId: string,
): string {
  return jwtService.sign(
    { sub: userId },
    {
      secret: jwtConfig().refreshToken.secret,
      expiresIn: jwtConfig().refreshToken.expiresIn,
    },
  );
}
