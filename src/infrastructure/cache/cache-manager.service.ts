import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from './redis.service.js';
import { APP_CONSTANTS } from '@/shared/constants/app.constants.js';

@Injectable()
export class CacheManagerService {
  private readonly logger = new Logger(CacheManagerService.name);

  constructor(private readonly redisService: RedisService) {}

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redisService.get(key);
    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  }

  async set<T>(
    key: string,
    value: T,
    ttlSeconds: number = APP_CONSTANTS.CACHE.DEFAULT_TTL,
  ): Promise<void> {
    const serialized =
      typeof value === 'string' ? value : JSON.stringify(value);
    await this.redisService.set(key, serialized, ttlSeconds);
  }

  async invalidate(key: string): Promise<void> {
    await this.redisService.del(key);
    this.logger.debug(`Cache invalidated: ${key}`);
  }

  async invalidatePattern(pattern: string): Promise<void> {
    await this.redisService.flushPattern(pattern);
    this.logger.debug(`Cache invalidated pattern: ${pattern}`);
  }

  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttlSeconds: number = APP_CONSTANTS.CACHE.DEFAULT_TTL,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) return cached;

    const value = await factory();
    await this.set(key, value, ttlSeconds);
    return value;
  }
}
