import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryChatUserDto {
  @ApiPropertyOptional({ example: 'John', description: 'Search name or email' })
  @IsOptional()
  @IsString()
  q?: string;
}

export class ChatUserDirectoryResponseDto {
  @ApiProperty({ example: 'usr_123abc', description: 'User ID' })
  id!: string;

  @ApiProperty({ example: 'John Doe', description: 'User display name' })
  name!: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address',
  })
  email!: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'Avatar URL',
  })
  image!: string | null;
}
