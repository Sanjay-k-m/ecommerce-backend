import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'Name of the category',
    example: 'Electronics',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  name?: string;

  @ApiProperty({
    description: 'Description of the category',
    example: 'Updated description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
