import { IsNumber, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateInventoryDto {
  @ApiProperty({
    description: 'New stock quantity for the product',
    example: 100,
  })
  @IsNumber()
  @Min(0, { message: 'Quantity must be non-negative' })
  @IsOptional()
  quantity?: number;

  @ApiProperty({
    description: 'Reason for stock adjustment',
    example: 'Restock from supplier',
    required: false,
  })
  @IsOptional()
  reason?: string;
}
