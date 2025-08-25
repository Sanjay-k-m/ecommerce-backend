// src/modules/auth/dto/v1/register-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/dto/base-response.dto';

export class RegisterInitiateResponseDto extends BaseResponseDto {
  @ApiProperty({ example: 'Registration email sent successfully' })
  message!: string;
}
