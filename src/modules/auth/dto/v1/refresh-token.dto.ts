import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    example: 1,
    description: 'User ID',
  })
  @IsString()
  userId!: string;

  @ApiProperty({
    example: 'refreshTokenStringHere',
    description: 'Refresh token provided by the client',
  })
  @IsString()
  refreshToken!: string;
}
