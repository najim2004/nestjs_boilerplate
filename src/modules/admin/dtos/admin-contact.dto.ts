import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAdminContactDto {
  @ApiProperty({ example: 'John', description: 'First name of contact' })
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of contact' })
  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiPropertyOptional({ example: '+1234567890', description: 'Phone number' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({
    example: 'I would like to inquire about your services.',
    description: 'Message content',
  })
  @IsNotEmpty()
  @IsString()
  message!: string;
}

export class UpdateAdminContactDto {
  @ApiPropertyOptional({ example: 'John', description: 'First name' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe', description: 'Last name' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    example: 'john.doe@example.com',
    description: 'Email',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+1234567890', description: 'Phone number' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({
    example: 'Updated inquiry message.',
    description: 'Message',
  })
  @IsOptional()
  @IsString()
  message?: string;
}

export class QueryAdminContactDto {
  @ApiPropertyOptional({
    example: 'John',
    description: 'Search term for name or email',
  })
  @IsOptional()
  @IsString()
  q?: string;
}

export class AdminContactResponseDto {
  @ApiProperty({ example: 'clk123abc456', description: 'Contact ID' })
  id!: string;

  @ApiProperty({ example: 'John', description: 'First name' })
  firstName!: string | null;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  lastName!: string | null;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address',
  })
  email!: string | null;

  @ApiProperty({ example: '+1234567890', description: 'Phone number' })
  phoneNumber!: string | null;

  @ApiProperty({
    example: 'Inquiry details text',
    description: 'Contact message',
  })
  message!: string | null;

  @ApiProperty({
    example: '2026-07-27T10:00:00.000Z',
    description: 'Created timestamp',
  })
  createdAt!: Date;
}
