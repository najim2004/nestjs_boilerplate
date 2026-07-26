import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { APP_CONSTANTS } from '@/shared/constants/app.constants';
import { EmailService } from '@/infrastructure/email/email.service';
import { ISendEmailData } from '../queues/email.queue';

@Processor(APP_CONSTANTS.QUEUE.EMAIL)
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private readonly emailService: EmailService) {
    super();
  }

  @OnWorkerEvent('active')
  onActive(job: Job): void {
    this.logger.debug(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job): void {
    this.logger.log(`Job ${job.id} completed successfully`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job | undefined, error: Error): void {
    this.logger.error(`Job ${job?.id} failed: ${error.message}`, error.stack);
  }

  async process(job: Job<ISendEmailData>): Promise<void> {
    try {
      if (job.name === 'send-email') {
        await this.emailService.send(job.data);
      }
    } catch (error) {
      this.logger.error(`Failed to process email job: ${job.id}`, error);
      throw error;
    }
  }
}
