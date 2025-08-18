import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsEnum } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'The ID of the order to pay for',
    example: '68a20a15ff0aa9c1dbf05683',
  })
  @IsNotEmpty({ message: 'Order ID is required' })
  @IsMongoId({ message: 'Invalid order ID' })
  orderId!: string;

  @ApiProperty({
    description: 'Payment method',
    enum: ['mock', 'cod'],
    example: 'mock',
  })
  @IsNotEmpty({ message: 'Payment method is required' })
  @IsEnum(['mock', 'cod'], { message: 'Method must be either mock or cod' })
  method!: string;
}
