import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum } from 'class-validator';
import { PaymentStatus } from '@prisma/client';

export class UpdatePaymentStatusDto {
  @ApiProperty({
    description: 'Payment status',
    enum: PaymentStatus,
    example: PaymentStatus.pending,
  })
  @IsNotEmpty({ message: 'Payment status is required' })
  @IsEnum(PaymentStatus, {
    message: `Status must be one of: ${Object.values(PaymentStatus).join(
      ', ',
    )}`,
  })
  status!: PaymentStatus;
}
