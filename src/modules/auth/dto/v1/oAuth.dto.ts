import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional } from 'class-validator';

export class SocialLoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'google',
    description: 'Social provider name',
  })
  @IsString()
  socialProvider!: string;

  @ApiProperty({
    example: 'google-id-123456',
    description: 'Social provider user ID',
  })
  @IsString()
  socialId!: string;

  @ApiProperty({
    example: 'username123',
    description: 'Optional username',
    required: false,
  })
  @IsOptional()
  @IsString()
  username?: string;
}
