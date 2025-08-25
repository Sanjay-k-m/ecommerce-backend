import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/dto/base-response.dto';

export class ForgotPasswordInitiateResponseDto extends BaseResponseDto {
  @ApiProperty({ example: 'Password reset email sent successfully.' })
  message!: string;
}
