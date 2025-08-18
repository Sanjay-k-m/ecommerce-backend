import { IsArray, IsNotEmpty, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class OrderItemDto {
  @ApiProperty({
    description: 'Product ID',
    example: 'product_id_here',
  })
  @IsNotEmpty({ message: 'Product ID cannot be empty' })
  productId!: string;

  @ApiProperty({
    description: 'Quantity of the product',
    example: 2,
  })
  @IsNumber({}, { message: 'Quantity must be a number' })
  @IsNotEmpty({ message: 'Quantity cannot be empty' })
  quantity!: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'List of order items',
    type: [OrderItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}
