import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAdminFaqDto {
  @ApiProperty({
    example: 'What services do you provide?',
    description: 'FAQ Question',
  })
  @IsNotEmpty()
  @IsString()
  question!: string;

  @ApiProperty({
    example: 'We offer full-stack software development.',
    description: 'FAQ Answer',
  })
  @IsNotEmpty()
  @IsString()
  answer!: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Status flag (1: active, 0: inactive)',
  })
  @IsOptional()
  @IsInt()
  status?: number;

  @ApiPropertyOptional({ example: 1, description: 'Sort order' })
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

export class UpdateAdminFaqDto {
  @ApiPropertyOptional({
    example: 'What services do you provide?',
    description: 'FAQ Question',
  })
  @IsOptional()
  @IsString()
  question?: string;

  @ApiPropertyOptional({
    example: 'Updated answer content.',
    description: 'FAQ Answer',
  })
  @IsOptional()
  @IsString()
  answer?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Status flag (1: active, 0: inactive)',
  })
  @IsOptional()
  @IsInt()
  status?: number;

  @ApiPropertyOptional({ example: 2, description: 'Sort order' })
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

export class AdminFaqResponseDto {
  @ApiProperty({ example: 'faq_123abc', description: 'FAQ ID' })
  id!: string;

  @ApiProperty({
    example: 'What services do you provide?',
    description: 'FAQ Question',
  })
  question!: string | null;

  @ApiProperty({
    example: 'We offer software development.',
    description: 'FAQ Answer',
  })
  answer!: string | null;

  @ApiProperty({ example: 1, description: 'Status' })
  status!: number | null;

  @ApiProperty({ example: 0, description: 'Sort order' })
  sortOrder!: number | null;

  @ApiProperty({
    example: '2026-07-27T10:00:00.000Z',
    description: 'Created timestamp',
  })
  createdAt!: Date;
}
