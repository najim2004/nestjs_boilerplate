import { ApiProperty } from '@nestjs/swagger';

export class ApplicationNotificationResponseDto {
  @ApiProperty({ example: 'notif_123abc', description: 'Notification ID' })
  id!: string;

  @ApiProperty({ example: 'WELCOME', description: 'Notification type' })
  type!: string | null;

  @ApiProperty({
    example: 'Welcome to our platform!',
    description: 'Notification text',
  })
  text!: string | null;

  @ApiProperty({
    example: '2026-07-27T10:00:00.000Z',
    description: 'Read timestamp or null if unread',
  })
  readAt!: Date | null;

  @ApiProperty({
    example: '2026-07-27T09:00:00.000Z',
    description: 'Created timestamp',
  })
  createdAt!: Date;
}
