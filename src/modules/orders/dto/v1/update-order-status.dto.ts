import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'The status of the order',
    enum: OrderStatus,
    example: OrderStatus.pending,
  })
  @IsNotEmpty({ message: 'Status is required' })
  @IsEnum(OrderStatus, {
    message: `Status must be one of: ${Object.values(OrderStatus).join(', ')}`,
  })
  status!: OrderStatus;
}
