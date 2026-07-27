import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAdminNotificationDto {
  @ApiProperty({
    example: 'SYSTEM_ALERT',
    description: 'Notification type code',
  })
  @IsNotEmpty()
  @IsString()
  type!: string;

  @ApiProperty({
    example: 'Maintenance scheduled for 12:00 AM UTC',
    description: 'Notification text message',
  })
  @IsNotEmpty()
  @IsString()
  text!: string;

  @ApiPropertyOptional({
    example: 'usr_123abc',
    description: 'Receiver user ID (optional)',
  })
  @IsOptional()
  @IsString()
  receiverId?: string;

  @ApiPropertyOptional({
    example: 'entity_99',
    description: 'Associated entity ID',
  })
  @IsOptional()
  @IsString()
  entityId?: string;
}

export class AdminNotificationResponseDto {
  @ApiProperty({ example: 'notif_123abc', description: 'Notification ID' })
  id!: string;

  @ApiProperty({ example: 'SYSTEM_ALERT', description: 'Notification type' })
  type!: string | null;

  @ApiProperty({
    example: 'Maintenance scheduled for 12:00 AM UTC',
    description: 'Notification text',
  })
  text!: string | null;

  @ApiProperty({ example: 'usr_sender123', description: 'Sender ID' })
  senderId!: string | null;

  @ApiProperty({ example: 'usr_receiver123', description: 'Receiver ID' })
  receiverId!: string | null;

  @ApiProperty({ example: 1, description: 'Status' })
  status!: number | null;

  @ApiProperty({
    example: '2026-07-27T10:00:00.000Z',
    description: 'Created timestamp',
  })
  createdAt!: Date;
}
