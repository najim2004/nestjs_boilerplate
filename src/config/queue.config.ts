import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const queueConfigSchema = z.object({
  redisHost: z.string().default('localhost'),
  redisPort: z.coerce.number().default(6379),
  redisPassword: z.string().optional().default(''),
});

export type QueueConfig = z.infer<typeof queueConfigSchema>;

export default registerAs('queue', (): QueueConfig => {
  return queueConfigSchema.parse({
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
    redisPassword: process.env.REDIS_PASSWORD,
  });
});
