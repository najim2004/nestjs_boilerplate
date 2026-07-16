import {
  Injectable,
  Inject,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import Redis from 'ioredis';

interface RedisOptions {
  host: string;
  port: number;
  password: string;
}

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis;

  constructor(@Inject('REDIS_OPTIONS') private readonly options: RedisOptions) {
    this.client = new Redis({
      host: this.options.host,
      port: this.options.port,
      password: this.options.password || undefined,
      retryStrategy: (times: number) => Math.min(times * 50, 2000),
    });
  }

  onModuleInit(): void {
    this.client.on('connect', () => {
      this.logger.log('✅ Redis connected successfully');
    });

    this.client.on('error', (err: Error) => {
      this.logger.error('❌ Redis connection error', err.message);
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
    this.logger.log('Redis disconnected');
  }

  getClient(): Redis {
    return this.client;
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.set(key, value, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  async keys(pattern: string): Promise<string[]> {
    return this.client.keys(pattern);
  }

  async flushPattern(pattern: string): Promise<void> {
    const matchedKeys = await this.keys(pattern);
    if (matchedKeys.length > 0) {
      await this.client.del(...matchedKeys);
    }
  }
}
