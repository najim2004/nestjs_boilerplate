import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendChatMessageDto {
  @ApiProperty({ example: 'conv_123abc', description: 'Conversation ID' })
  @IsNotEmpty()
  @IsString()
  conversationId!: string;

  @ApiProperty({
    example: 'Hello, how can I help you today?',
    description: 'Message body content',
  })
  @IsNotEmpty()
  @IsString()
  message!: string;

  @ApiPropertyOptional({
    example: 'att_123abc',
    description: 'Attachment ID (optional)',
  })
  @IsOptional()
  @IsString()
  attachmentId?: string;
}

export class AttachmentResponseDto {
  @ApiProperty({ example: 'att_123abc', description: 'Attachment ID' })
  id!: string;

  @ApiProperty({ example: 'document.pdf', description: 'Original file name' })
  name!: string | null;

  @ApiProperty({ example: 'application/pdf', description: 'MIME type' })
  type!: string | null;

  @ApiProperty({ example: 102456, description: 'File size in bytes' })
  size!: number | null;

  @ApiProperty({
    example: 'https://storage.example.com/files/document.pdf',
    description: 'File URL',
  })
  file!: string | null;
}

export class ChatMessageResponseDto {
  @ApiProperty({ example: 'msg_123abc', description: 'Message ID' })
  id!: string;

  @ApiProperty({ example: 'conv_123abc', description: 'Conversation ID' })
  conversationId!: string | null;

  @ApiProperty({ example: 'usr_sender123', description: 'Sender User ID' })
  senderId!: string | null;

  @ApiProperty({ example: 'usr_receiver123', description: 'Receiver User ID' })
  receiverId!: string | null;

  @ApiProperty({
    example: 'Hello, how can I help you today?',
    description: 'Message content',
  })
  message!: string | null;

  @ApiProperty({
    example: 'SENT',
    description: 'Message status (PENDING, SENT, DELIVERED, READ)',
  })
  status!: string | null;

  @ApiPropertyOptional({
    type: AttachmentResponseDto,
    description: 'Attachment info',
  })
  attachment?: AttachmentResponseDto | null;

  @ApiProperty({
    example: '2026-07-27T10:00:00.000Z',
    description: 'Sent timestamp',
  })
  createdAt!: Date;
}
