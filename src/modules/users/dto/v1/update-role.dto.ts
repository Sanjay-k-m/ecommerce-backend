import { IsArray, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto {
  @ApiProperty({
    description: 'List of role names',
    example: ['user', 'admin'],
  })
  @IsArray()
  @IsIn(['user', 'admin'], { each: true, message: 'Invalid role name' })
  roles!: string[];
}
