// src/modules/auth/dto/v1/register-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { AuthTokensDto } from '../auth-tokens.dto';
import { BaseResponseDto } from 'src/dto/base-response.dto';

export class RegisterResponseDto extends BaseResponseDto {
  @ApiProperty({ example: 'send otp successfully to your email' })
  message!: string;

  @ApiProperty({ type: AuthTokensDto })
  data!: {
    tokens: AuthTokensDto;
  };
}
