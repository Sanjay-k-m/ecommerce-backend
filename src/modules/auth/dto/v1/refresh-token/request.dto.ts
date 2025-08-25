import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokensRequestDto {
  @ApiProperty({
    example: 'refreshTokenStringHere',
    description: 'Refresh token provided by the client',
  })
  @IsString()
  refreshToken!: string;
}
