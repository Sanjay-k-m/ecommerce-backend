import { IsNotEmpty, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductSubcategoryIdParamDto {
  @ApiProperty({
    description: 'Subcategory ID',
    example: 'subcategory_id_here',
  })
  @IsNotEmpty({ message: 'Subcategory ID cannot be empty' })
  @IsMongoId({ message: 'Invalid subcategory ID' })
  subcategoryId!: string;
}

export class ProductWithIdParamDto {
  @ApiProperty({
    description: 'Subcategory ID',
    example: 'subcategory_id_here',
  })
  @IsNotEmpty({ message: 'Subcategory ID cannot be empty' })
  @IsMongoId({ message: 'Invalid subcategory ID' })
  subcategoryId!: string;

  @ApiProperty({ description: 'Product ID', example: 'product_id_here' })
  @IsNotEmpty({ message: 'Product ID cannot be empty' })
  @IsMongoId({ message: 'Invalid product ID' })
  id!: string;
}
