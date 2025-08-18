import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AddressType } from '@prisma/client';

export class CreateAddressDto {
  @ApiProperty({ description: 'Recipient first name', example: 'John' })
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName!: string;

  @ApiProperty({ description: 'Recipient last name', example: 'Doe' })
  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName!: string;

  @ApiProperty({
    description: 'Contact phone number',
    example: '+1-555-555-5555',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'Street address', example: '123 Main St' })
  @IsString()
  @IsNotEmpty({ message: 'Street is required' })
  street!: string;

  @ApiProperty({
    description: 'Additional address line (e.g., apartment)',
    example: 'Apt 4B',
    required: false,
  })
  @IsString()
  @IsOptional()
  addressLine2?: string;

  @ApiProperty({ description: 'City', example: 'New York' })
  @IsString()
  @IsNotEmpty({ message: 'City is required' })
  city!: string;

  @ApiProperty({ description: 'State or province', example: 'NY' })
  @IsString()
  @IsNotEmpty({ message: 'State is required' })
  state!: string;

  @ApiProperty({ description: 'Country', example: 'USA' })
  @IsString()
  @IsNotEmpty({ message: 'Country is required' })
  country!: string;

  @ApiProperty({ description: 'Zip or postal code', example: '10001' })
  @IsString()
  @IsNotEmpty({ message: 'Zip code is required' })
  zipCode!: string;

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
  })
  @IsEnum(AddressType)
  @IsNotEmpty({ message: 'Address type is required' })
  type!: AddressType;

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
