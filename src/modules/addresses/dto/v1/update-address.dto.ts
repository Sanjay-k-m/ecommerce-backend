import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AddressType } from '@prisma/client';

export class UpdateAddressDto {
  @ApiProperty({
    description: 'Recipient first name',
    example: 'John',
    required: false,
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    description: 'Recipient last name',
    example: 'Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    description: 'Contact phone number',
    example: '+1-555-555-5555',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'Street address',
    example: '123 Main St',
    required: false,
  })
  @IsString()
  @IsOptional()
  street?: string;

  @ApiProperty({
    description: 'Additional address line (e.g., apartment)',
    example: 'Apt 4B',
    required: false,
  })
  @IsString()
  @IsOptional()
  addressLine2?: string;

  @ApiProperty({ description: 'City', example: 'New York', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({
    description: 'State or province',
    example: 'NY',
    required: false,
  })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({ description: 'Country', example: 'USA', required: false })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({
    description: 'Zip or postal code',
    example: '10001',
    required: false,
  })
  @IsString()
  @IsOptional()
  zipCode?: string;

  @ApiProperty({
    description: 'Latitude for GPS location',
    example: 40.7128,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({
    description: 'Longitude for GPS location',
    example: -74.006,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({
    description: 'Address type',
    enum: AddressType,
    example: 'shipping',
    required: false,
  })
  @IsEnum(AddressType)
  @IsOptional()
  type?: AddressType;

  @ApiProperty({
    description: 'Is default address',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @ApiProperty({
    description: 'Delivery instructions',
    example: 'Leave at front door',
    required: false,
  })
  @IsString()
  @IsOptional()
  deliveryInstructions?: string;

  @ApiProperty({
    description: 'Address label',
    example: 'Home',
    required: false,
  })
  @IsString()
  @IsOptional()
  label?: string;
}
