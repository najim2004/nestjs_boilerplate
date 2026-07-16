import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { APP_CONSTANTS } from '@/shared/constants/app.constants.js';

export interface ISendNotificationData {
  userId: string;
  title: string;
  body: string;
  type: string;
}

@Injectable()
export class NotificationQueueService {
  private readonly logger = new Logger(NotificationQueueService.name);

  constructor(
    @InjectQueue(APP_CONSTANTS.QUEUE.NOTIFICATION)
    private readonly notificationQueue: Queue,
  ) {}

  async sendNotification(data: ISendNotificationData): Promise<void> {
    try {
      await this.notificationQueue.add('send-notification', data, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      });
      this.logger.log(`Added notification to queue for user: ${data.userId}`);
    } catch (error) {
      this.logger.error(
        `Failed to add notification to queue for user: ${data.userId}`,
        error,
      );
      throw error;
    }
  }
}
