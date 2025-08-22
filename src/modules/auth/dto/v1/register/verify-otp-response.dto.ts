import { ApiProperty } from '@nestjs/swagger';
import { AuthTokensDto } from '../auth-tokens.dto';
import { BaseResponseDto } from 'src/dto/base-response.dto';

export class VerifyOtpResponseDto extends BaseResponseDto {
  @ApiProperty({ example: 'OTP verified successfully' })
  message!: string;

  @ApiProperty({ type: AuthTokensDto })
  data!: {
    tokens: AuthTokensDto;
  };
}
