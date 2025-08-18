import { IsNotEmpty, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderIdParamDto {
  @ApiProperty({
    description: 'Order ID',
    example: 'order_id_here',
  })
  @IsNotEmpty({ message: 'Order ID cannot be empty' })
  @IsMongoId({ message: 'Invalid order ID' })
  id!: string;
}
