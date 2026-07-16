import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const databaseConfigSchema = z.object({
  url: z.string(),
});

export type DatabaseConfig = z.infer<typeof databaseConfigSchema>;

export default registerAs('database', (): DatabaseConfig => {
  return databaseConfigSchema.parse({
    url: process.env.DATABASE_URL,
  });
});
