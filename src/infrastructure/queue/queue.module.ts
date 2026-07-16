import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { APP_CONSTANTS } from '@/shared/constants/app.constants.js';
import { EmailQueueService } from './queues/email.queue.js';
import { NotificationQueueService } from './queues/notification.queue.js';
import { EmailProcessor } from './processors/email.processor.js';
import { NotificationProcessor } from './processors/notification.processor.js';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('queue.redisHost', 'localhost'),
          port: configService.get<number>('queue.redisPort', 6379),
          password:
            configService.get<string>('queue.redisPassword') || undefined,
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      { name: APP_CONSTANTS.QUEUE.EMAIL },
      { name: APP_CONSTANTS.QUEUE.NOTIFICATION },
    ),
  ],
  providers: [
    EmailQueueService,
    NotificationQueueService,
    EmailProcessor,
    NotificationProcessor,
  ],
  exports: [EmailQueueService, NotificationQueueService],
})
export class QueueModule {}
