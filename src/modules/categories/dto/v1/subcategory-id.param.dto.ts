// subcategory-params.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsMongoId } from 'class-validator';

/**
 * DTO for routes that need only Category ID
 */
export class SubcategoryCategoryIdParamDto {
  @ApiProperty({ description: 'Category ID' })
  @IsNotEmpty({ message: 'Category ID cannot be empty' })
  @IsMongoId({ message: 'Invalid category ID' })
  categoryId!: string;
}

/**
 * DTO for routes that need both Category ID and Subcategory ID
 */
export class SubcategoryWithIdParamDto {
  @ApiProperty({ description: 'Category ID' })
  @IsNotEmpty({ message: 'Category ID cannot be empty' })
  @IsMongoId({ message: 'Invalid category ID' })
  categoryId!: string;

  @ApiProperty({ description: 'Subcategory ID' })
  @IsNotEmpty({ message: 'Subcategory ID cannot be empty' })
  @IsMongoId({ message: 'Invalid subcategory ID' })
  id!: string;
}
