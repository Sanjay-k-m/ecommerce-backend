// src/modules/auth/dto/v1/login-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { AuthTokensDto } from '../auth-tokens.dto';
import { BaseResponseDto } from 'src/dto/base-response.dto';

export class LoginResponseDto extends BaseResponseDto {
  @ApiProperty({ example: 'Login successful.' })
  message!: string;

  @ApiProperty({ type: AuthTokensDto })
  data!: {
    tokens: AuthTokensDto;
  };
}
