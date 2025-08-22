// src/modules/auth/dto/v1/auth-tokens.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class AuthTokensDto {
  @ApiProperty({
    example: {
      access_token: 'access_token_here',
      refresh_token: 'refresh_token_here',
    },
  })
  tokens!: {
    access_token: string;
    refresh_token: string;
  };
}
