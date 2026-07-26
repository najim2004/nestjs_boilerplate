import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { APP_CONSTANTS } from '@/shared/constants/app.constants';
import { ISendNotificationData } from '../queues/notification.queue';

@Processor(APP_CONSTANTS.QUEUE.NOTIFICATION)
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  @OnWorkerEvent('active')
  onActive(job: Job): void {
    this.logger.debug(`Processing notification job ${job.id}`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job): void {
    this.logger.log(`Notification Job ${job.id} completed successfully`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job | undefined, error: Error): void {
    this.logger.error(`Notification Job ${job?.id} failed: ${error.message}`);
  }

  async process(job: Job<ISendNotificationData>): Promise<void> {
    await Promise.resolve();
    try {
      if (job.name === 'send-notification') {
        this.logger.log(
          `Processing notification for user ${job.data.userId}: ${job.data.title}`,
        );
        // TODO: Integrate with websockets, FCM, etc.
      }
    } catch (error) {
      this.logger.error(`Failed to process notification job: ${job.id}`, error);
      throw error;
    }
  }
}
