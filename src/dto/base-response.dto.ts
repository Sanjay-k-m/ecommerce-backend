// src/modules/auth/dto/v1/base-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto {
  @ApiProperty({ example: 'success' })
  status!: 'success' | 'error';
}
