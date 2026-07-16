import { z } from 'zod';
import { registerAs } from '@nestjs/config';

export const throttlerConfigSchema = z.object({
  ttl: z.number().default(60000), // 1 minute
  limit: z.number().default(100), // 100 requests per minute
});

export type ThrottlerConfig = z.infer<typeof throttlerConfigSchema>;

export default registerAs('throttler', () => {
  const parsed = throttlerConfigSchema.safeParse({
    ttl: Number(process.env.THROTTLER_TTL) || 60000,
    limit: Number(process.env.THROTTLER_LIMIT) || 100,
  });
  if (!parsed.success) {
    throw new Error(`Invalid throttler config: ${parsed.error.message}`);
  }
  return parsed.data;
});
