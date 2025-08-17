import { IsNotEmpty, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CartItemIdParamDto {
  @ApiProperty({
    description: 'Cart item ID',
    example: 'cart_item_id_here',
  })
  @IsNotEmpty({ message: 'Cart item ID cannot be empty' })
  @IsMongoId({ message: 'Invalid cart item ID' })
  id!: string;
}
