import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class QueryAdminUserDto {
  @ApiPropertyOptional({
    example: 'John',
    description: 'Search term for name or email',
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'User status (1: active, 0: banned/inactive)',
  })
  @IsOptional()
  @IsInt()
  status?: number;
}

export class UpdateAdminUserDto {
  @ApiPropertyOptional({ example: 'John', description: 'First name' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe', description: 'Last name' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    example: 'admin',
    description: 'Role (user, admin, moderator)',
  })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Status (1: active, 0: inactive)',
  })
  @IsOptional()
  @IsInt()
  status?: number;
}

export class AdminUserResponseDto {
  @ApiProperty({ example: 'usr_123abc', description: 'User ID' })
  id!: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name' })
  name!: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address',
  })
  email!: string;

  @ApiProperty({ example: 'admin', description: 'User role' })
  role!: string;

  @ApiProperty({ example: 1, description: 'User status flag' })
  status!: number | null;

  @ApiProperty({ example: '+1234567890', description: 'Phone number' })
  phoneNumber!: string | null;

  @ApiProperty({
    example: '2026-07-27T10:00:00.000Z',
    description: 'Created timestamp',
  })
  createdAt!: Date;
}
