import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  // IsOptional,
  // IsBoolean,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'User password (min 6 characters)',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password!: string;

  // @ApiProperty({
  //   example: 'john_doe',
  //   description: 'Optional username for the user',
  //   required: false,
  // })
  // @IsOptional()
  // @IsString()
  // username?: string;

  // @ApiProperty({
  //   example: true,
  //   description: 'Enable two-factor authentication (optional)',
  //   required: false,
  // })
  // @IsOptional()
  // @IsBoolean()
  // twoFactorEnabled?: boolean;

  // @ApiProperty({
  //   example: 'google',
  //   description: 'Optional social provider (e.g., Google, Facebook)',
  //   required: false,
  // })
  // @IsOptional()
  // @IsString()
  // socialProvider?: string;

  // @ApiProperty({
  //   example: 'google-id-123456',
  //   description: 'Social provider user ID (if using social login)',
  //   required: false,
  // })
  // @IsOptional()
  // @IsString()
  // socialId?: string;
}
