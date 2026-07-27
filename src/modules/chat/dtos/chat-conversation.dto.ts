import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateConversationDto {
  @ApiProperty({
    example: 'usr_participant123',
    description: 'Participant User ID',
  })
  @IsNotEmpty()
  @IsString()
  participantId!: string;
}

export class ChatUserSummaryDto {
  @ApiProperty({ example: 'usr_123', description: 'User ID' })
  id!: string;

  @ApiProperty({ example: 'John Doe', description: 'User name' })
  name!: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'Avatar image URL',
  })
  image!: string | null;
}

export class ConversationResponseDto {
  @ApiProperty({ example: 'conv_123abc', description: 'Conversation ID' })
  id!: string;

  @ApiProperty({
    type: ChatUserSummaryDto,
    description: 'Creator user details',
  })
  creator!: ChatUserSummaryDto | null;

  @ApiProperty({
    type: ChatUserSummaryDto,
    description: 'Participant user details',
  })
  participant!: ChatUserSummaryDto | null;

  @ApiProperty({
    example: '2026-07-27T10:00:00.000Z',
    description: 'Created timestamp',
  })
  createdAt!: Date;
}
