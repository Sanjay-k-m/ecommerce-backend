import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserIdParamDto {
  @ApiProperty({ description: 'User ID', example: '507f1f77bcf86cd799439011' })
  @IsString()
  @IsNotEmpty({ message: 'User ID is required' })
  id!: string;
}
