import { IsNotEmpty, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MediaIdParamDto {
  @ApiProperty({
    description: 'Media ID',
    example: 'media_id_here',
  })
  @IsNotEmpty({ message: 'Media ID cannot be empty' })
  @IsMongoId({ message: 'Invalid media ID' })
  id!: string;
}
