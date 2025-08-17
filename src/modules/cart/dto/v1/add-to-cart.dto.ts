import { IsNotEmpty, IsMongoId, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({
    description: 'Product ID to add to cart',
    example: 'product_id_here',
  })
  @IsNotEmpty({ message: 'Product ID cannot be empty' })
  @IsMongoId({ message: 'Invalid product ID' })
  productId!: string;

  @ApiProperty({
    description: 'Quantity to add',
    example: 1,
  })
  @IsInt({ message: 'Quantity must be an integer' })
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity!: number;
}
