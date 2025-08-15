interface JwtConfig {
  accessToken: {
    secret: string;
    expiresIn: string;
    ignoreExpiration: boolean;
  };
  refreshToken: {
    secret: string;
    expiresIn: string;
  };
}
export const jwtConfig = (): JwtConfig => ({
  accessToken: {
    secret: process.env.JWT_ACCESS_TOKEN_SECRET || 'keyforaccesstoken',
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '15m',
    ignoreExpiration:
      process.env.JWT_ACCESS_TOKEN_EXPIRES_IN === 'true' ? true : false,
  },
  refreshToken: {
    secret: process.env.JWT_REFRESH_TOKEN_SECRET || 'keyforrefreshingtoken',
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '7d',
  },
});
