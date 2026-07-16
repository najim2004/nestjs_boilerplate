import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

// Configurations
import appConfig from './config/app.config.js';
import databaseConfig from './config/database.config.js';
import redisConfig from './config/redis.config.js';
import queueConfig from './config/queue.config.js';
import emailConfig from './config/email.config.js';
import authConfig from './config/auth.config.js';
import websocketConfig from './config/websocket.config.js';
import storageConfig from './config/storage.config.js';
import throttlerConfig from './config/throttler.config.js';
import paymentConfig from './config/payment.config.js';

// Infrastructure
import { PrismaModule } from './infrastructure/database/prisma.module.js';
import { RedisModule } from './infrastructure/cache/redis.module.js';
import { QueueModule } from './infrastructure/queue/queue.module.js';
import { EmailModule } from './infrastructure/email/email.module.js';
import { WebsocketModule } from './infrastructure/websocket/websocket.module.js';
import { BetterAuthModule } from './infrastructure/auth-provider/better-auth.module.js';
import { HealthModule } from './infrastructure/health/health.module.js';
import { StorageModule } from './infrastructure/storage/storage.module.js';
import { PrometheusModule } from './infrastructure/prometheus/prometheus.module.js';
import { CaslModule } from './infrastructure/casl/casl.module.js';
import { CommandsModule } from './infrastructure/commands/commands.module.js';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
// Middlewares & Guards & Interceptors
import { BetterAuthMiddleware } from './infrastructure/auth-provider/better-auth.middleware.js';
import { BetterAuthGuard } from './shared/guards/better-auth.guard.js';
import { AbilitiesGuard } from './shared/guards/abilities.guard.js';
import { ThrottlerGuard } from '@nestjs/throttler';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor.js';
import { TimeoutInterceptor } from './shared/interceptors/timeout.interceptor.js';

// Domains
import { AuthModule } from './modules/auth/auth.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { AdminModule } from './modules/admin/admin.module.js';
import { PaymentModule } from './modules/payment/payment.module.js';

@Module({
  imports: [
    // Global Config
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        databaseConfig,
        redisConfig,
        queueConfig,
        emailConfig,
        authConfig,
        websocketConfig,
        storageConfig,
        throttlerConfig,
        paymentConfig,
      ],
      envFilePath: '.env',
    }),

    // Infrastructure Modules
    PrismaModule,
    RedisModule,
    QueueModule,
    EmailModule,
    WebsocketModule,
    BetterAuthModule,
    HealthModule,
    StorageModule,
    PrometheusModule,
    CaslModule,
    CommandsModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>('throttler.ttl') || 60000,
          limit: config.get<number>('throttler.limit') || 100,
        },
      ],
    }),

    // Domain Modules
    AuthModule,
    UsersModule,
    AdminModule,
    PaymentModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: BetterAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AbilitiesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BetterAuthMiddleware).forRoutes('*');
  }
}
