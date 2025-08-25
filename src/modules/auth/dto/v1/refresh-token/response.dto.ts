// src/modules/auth/dto/v1/refresh-token-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { AuthTokensDto } from '../auth-tokens.dto';
import { BaseResponseDto } from 'src/dto/base-response.dto';

export class RefreshTokenResponseDto extends BaseResponseDto {
  @ApiProperty({ example: 'Token refresh successful.' })
  message!: string;

  @ApiProperty({ type: AuthTokensDto })
  data!: {
    tokens: AuthTokensDto;
  };
}
