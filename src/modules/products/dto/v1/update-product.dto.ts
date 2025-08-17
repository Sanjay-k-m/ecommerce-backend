import { IsString, IsOptional, IsNumber, Min, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductStatus } from '@prisma/client';

export class UpdateProductDto {
  @ApiProperty({
    description: 'Name of the product',
    example: 'Updated Smartphone',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Description of the product',
    example: 'Updated description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Price of the product',
    example: 349.99,
    required: false,
  })
  @IsNumber()
  @Min(0, { message: 'Price must be non-negative' })
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: 'Available quantity of the product',
    example: 50,
    required: false,
  })
  @IsNumber()
  @Min(0, { message: 'Quantity must be non-negative' })
  @IsOptional()
  quantity?: number;

  @ApiProperty({
    description: 'Status of the product',
    enum: ProductStatus,
    required: false,
  })
  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;
}
