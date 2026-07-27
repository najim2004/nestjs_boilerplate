import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

// Configurations
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import redisConfig from './config/redis.config';
import queueConfig from './config/queue.config';
import emailConfig from './config/email.config';
import authConfig from './config/auth.config';
import websocketConfig from './config/websocket.config';
import storageConfig from './config/storage.config';
import throttlerConfig from './config/throttler.config';
import paymentConfig from './config/payment.config';

// Infrastructure
import { PrismaModule } from './infrastructure/database/prisma.module';
import { RedisModule } from './infrastructure/cache/redis.module';
import { QueueModule } from './infrastructure/queue/queue.module';
import { EmailModule } from './infrastructure/email/email.module';
import { WebsocketModule } from './infrastructure/websocket/websocket.module';
import { BetterAuthModule } from './infrastructure/auth-provider/better-auth.module';
import { HealthModule } from './infrastructure/health/health.module';
import { StorageModule } from './infrastructure/storage/storage.module';
import { PrometheusModule } from './infrastructure/prometheus/prometheus.module';
import { CaslModule } from './infrastructure/casl/casl.module';
import { CommandsModule } from './infrastructure/commands/commands.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
// Middlewares & Guards & Interceptors
import { BetterAuthMiddleware } from './infrastructure/auth-provider/better-auth.middleware';
import { BetterAuthGuard } from './shared/guards/better-auth.guard';
import { AbilitiesGuard } from './shared/guards/abilities.guard';
import { ThrottlerGuard } from '@nestjs/throttler';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { TimeoutInterceptor } from './shared/interceptors/timeout.interceptor';

// Domains
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AdminModule } from './modules/admin/admin.module';
import { PaymentModule } from './modules/payment/payment.module';
import { ApplicationModule } from './modules/application/application.module';
import { ChatModule } from './modules/chat/chat.module';

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
    ApplicationModule,
    ChatModule,
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
