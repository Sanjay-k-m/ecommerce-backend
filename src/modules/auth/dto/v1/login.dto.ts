import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  // IsOptional
} from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'User password',
  })
  @IsString()
  password!: string;

  // @ApiProperty({
  //   example: '123456',
  //   description: 'Optional 2FA code if enabled',
  //   required: false,
  // })
  // @IsOptional()
  // @IsString()
  // twoFactorCode?: string;
}
