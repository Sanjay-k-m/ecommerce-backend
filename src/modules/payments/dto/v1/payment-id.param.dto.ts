import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class PaymentIdParamDto {
  @ApiProperty({
    description: 'The ID of the payment',
    example: '68a20a15ff0aa9c1dbf05684',
  })
  @IsMongoId({ message: 'Invalid payment ID' })
  id!: string;
}
