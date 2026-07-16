import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { APP_CONSTANTS } from '@/shared/constants/app.constants.js';

export interface ISendEmailData {
  to: string;
  subject: string;
  template: string;
  context?: Record<string, unknown>;
}

@Injectable()
export class EmailQueueService {
  private readonly logger = new Logger(EmailQueueService.name);

  constructor(
    @InjectQueue(APP_CONSTANTS.QUEUE.EMAIL)
    private readonly emailQueue: Queue,
  ) {}

  async sendEmail(data: ISendEmailData): Promise<void> {
    try {
      await this.emailQueue.add('send-email', data, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      });
      this.logger.log(`Added email to queue for: ${data.to}`);
    } catch (error) {
      this.logger.error(`Failed to add email to queue: ${data.to}`, error);
      throw error;
    }
  }
}
