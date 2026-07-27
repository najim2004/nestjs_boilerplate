import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateApplicationContactDto {
  @ApiProperty({ example: 'Jane', description: 'First name' })
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @ApiProperty({ example: 'Smith', description: 'Last name' })
  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @ApiProperty({
    example: 'jane.smith@example.com',
    description: 'Email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiPropertyOptional({ example: '+1987654321', description: 'Phone number' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({
    example: 'Hello, I have a question regarding pricing.',
    description: 'Message content',
  })
  @IsNotEmpty()
  @IsString()
  message!: string;
}

export class ApplicationContactResponseDto {
  @ApiProperty({ example: 'cnt_123abc', description: 'Contact ID' })
  id!: string;

  @ApiProperty({ example: 'Jane', description: 'First name' })
  firstName!: string | null;

  @ApiProperty({ example: 'Smith', description: 'Last name' })
  lastName!: string | null;

  @ApiProperty({
    example: 'jane.smith@example.com',
    description: 'Email address',
  })
  email!: string | null;

  @ApiProperty({ example: '+1987654321', description: 'Phone number' })
  phoneNumber!: string | null;

  @ApiProperty({
    example: 'Hello, I have a question regarding pricing.',
    description: 'Message content',
  })
  message!: string | null;

  @ApiProperty({
    example: '2026-07-27T10:00:00.000Z',
    description: 'Submission timestamp',
  })
  createdAt!: Date;
}
