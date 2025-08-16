import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSubcategoryDto {
  @ApiProperty({
    description: 'Name of the subcategory',
    example: 'Smartphones',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  name?: string;

  @ApiProperty({
    description: 'Description of the subcategory',
    example: 'Updated description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
