import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'reset-token-here',
    description: 'Password reset token sent via email',
  })
  @IsString()
  token!: string;

  @ApiProperty({
    example: 'NewStrongPassword123',
    description: 'New password for the user',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  newPassword!: string;
}
