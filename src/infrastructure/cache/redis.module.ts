import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service.js';
import { CacheManagerService } from './cache-manager.service.js';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_OPTIONS',
      useFactory: (configService: ConfigService) => ({
        host: configService.get<string>('redis.host', 'localhost'),
        port: configService.get<number>('redis.port', 6379),
        password: configService.get<string>('redis.password', ''),
      }),
      inject: [ConfigService],
    },
    RedisService,
    CacheManagerService,
  ],
  exports: [RedisService, CacheManagerService],
})
export class RedisModule {}
