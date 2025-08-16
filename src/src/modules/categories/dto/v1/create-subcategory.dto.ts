import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubcategoryDto {
  @ApiProperty({
    description: 'Name of the subcategory',
    example: 'Smartphones',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name!: string;

  @ApiProperty({
    description: 'Description of the subcategory',
    example: 'All smartphone products',
  })
  @IsString()
  @IsNotEmpty()
  description!: string;
}
