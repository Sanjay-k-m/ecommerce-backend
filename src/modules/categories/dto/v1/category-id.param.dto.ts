// src/modules/categories/dto/v1/params/category-id.param.dto.ts
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class CategoryIdParamDto {
  @ApiProperty({ description: 'Category ID' })
  @IsNotEmpty({ message: 'Category ID cannot be empty' })
  @IsMongoId({ message: 'Invalid category ID' })
  id!: string;
}
