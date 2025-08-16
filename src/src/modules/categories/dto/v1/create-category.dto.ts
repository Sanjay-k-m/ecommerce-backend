import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Name of the category', example: 'Electronics' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name!: string;

  @ApiProperty({
    description: 'Description of the category',
    example: 'All electronic products',
  })
  @IsString()
  @IsNotEmpty()
  description!: string;
}
