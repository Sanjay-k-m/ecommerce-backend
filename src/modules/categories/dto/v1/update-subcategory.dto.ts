import { IsString, IsOptional, MinLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CategoryStatus } from '@prisma/client';

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

  @ApiProperty({
    description: 'Status of the subcategory',
    example: 'active',
    required: false,
    enum: ['active', 'inactive', 'deleted'],
  })
  @IsOptional()
  @IsEnum(CategoryStatus)
  status?: CategoryStatus;
}
