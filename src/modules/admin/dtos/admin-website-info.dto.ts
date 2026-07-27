import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateAdminWebsiteInfoDto {
  @ApiPropertyOptional({
    example: 'My Awesome Platform',
    description: 'Website name',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: '+1234567890',
    description: 'Contact phone number',
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({
    example: 'support@example.com',
    description: 'Contact email',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: '123 Tech Street, Silicon Valley, CA',
    description: 'Physical address',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/logo.png',
    description: 'Logo URL',
  })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/favicon.ico',
    description: 'Favicon URL',
  })
  @IsOptional()
  @IsString()
  favicon?: string;

  @ApiPropertyOptional({
    example: '© 2026 My Platform. All rights reserved.',
    description: 'Copyright text',
  })
  @IsOptional()
  @IsString()
  copyright?: string;

  @ApiPropertyOptional({
    example: 'Full refund within 14 days of purchase.',
    description: 'Cancellation policy text',
  })
  @IsOptional()
  @IsString()
  cancellationPolicy?: string;
}

export class AdminWebsiteInfoResponseDto {
  @ApiProperty({ example: 'info_123abc', description: 'Website info ID' })
  id!: string;

  @ApiProperty({ example: 'My Awesome Platform', description: 'Website name' })
  name!: string | null;

  @ApiProperty({ example: '+1234567890', description: 'Contact phone number' })
  phoneNumber!: string | null;

  @ApiProperty({ example: 'support@example.com', description: 'Contact email' })
  email!: string | null;

  @ApiProperty({ example: '123 Tech Street', description: 'Physical address' })
  address!: string | null;

  @ApiProperty({
    example: 'https://example.com/logo.png',
    description: 'Logo URL',
  })
  logo!: string | null;

  @ApiProperty({
    example: 'https://example.com/favicon.ico',
    description: 'Favicon URL',
  })
  favicon!: string | null;

  @ApiProperty({ example: '© 2026 My Platform', description: 'Copyright text' })
  copyright!: string | null;

  @ApiProperty({
    example: '14 days refund policy',
    description: 'Cancellation policy',
  })
  cancellationPolicy!: string | null;
}
