import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddressIdParamDto {
  @ApiProperty({
    description: 'Address ID',
    example: '68a3259f0539206e3ab03934',
  })
  @IsString()
  @IsNotEmpty({ message: 'Address ID is required' })
  id!: string;
}
