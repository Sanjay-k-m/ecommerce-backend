import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/dto/base-response.dto';

export class ForgotPasswordConfirmationResponseDto extends BaseResponseDto {
  @ApiProperty({ example: 'Password has been reset successfully.' })
  message!: string;
}
