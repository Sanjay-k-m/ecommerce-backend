import { IsOptional, IsMongoId, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MediaType } from '@prisma/client';

export class UpdateMediaDto {
  @ApiProperty({
    description: 'Type of the media (image or video)',
    enum: MediaType,
    example: MediaType.image,
    required: false,
  })
  @IsEnum(MediaType)
  @IsOptional()
  type?: MediaType;

  @ApiProperty({
    description: 'ID of the associated product (optional)',
    example: 'product_id_here',
    required: false,
  })
  @IsMongoId({ message: 'Invalid product ID' })
  @IsOptional()
  productId?: string;

  @ApiProperty({
    description: 'ID of the associated user (optional)',
    example: 'user_id_here',
    required: false,
  })
  @IsMongoId({ message: 'Invalid user ID' })
  @IsOptional()
  userId?: string;
}
