import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const authConfigSchema = z.object({
  secret: z.string().min(16),
  url: z.string().url().default('http://localhost:4000'),
});

export type AuthConfig = z.infer<typeof authConfigSchema>;

export default registerAs('auth', (): AuthConfig => {
  return authConfigSchema.parse({
    secret: process.env.BETTER_AUTH_SECRET,
    url: process.env.BETTER_AUTH_URL,
  });
});
