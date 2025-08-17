import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductStatus } from '@prisma/client';

export class CreateProductDto {
  @ApiProperty({
    description: 'Name of the product',
    example: 'Sample Smartphone',
  })
  @IsString()
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name!: string;

  @ApiProperty({
    description: 'Description of the product',
    example: 'A high-performance smartphone',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Price of the product', example: 299.99 })
  @IsNumber()
  @Min(0, { message: 'Price must be non-negative' })
  price!: number;

  @ApiProperty({
    description: 'Available quantity of the product',
    example: 100,
  })
  @IsNumber()
  @Min(0, { message: 'Quantity must be non-negative' })
  quantity!: number;

  @ApiProperty({
    description: 'Status of the product',
    enum: ProductStatus,
    default: ProductStatus.active,
  })
  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;
}
