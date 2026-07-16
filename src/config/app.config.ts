import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const appConfigSchema = z.object({
  name: z.string().default('nestjs-boilerplate'),
  port: z.coerce.number().default(4000),
  url: z.string().default('http://localhost:4000'),
  clientAppUrl: z.string().default('http://localhost:3000'),
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
});

export type AppConfig = z.infer<typeof appConfigSchema>;

export default registerAs('app', (): AppConfig => {
  return appConfigSchema.parse({
    name: process.env.APP_NAME,
    port: process.env.PORT,
    url: process.env.APP_URL,
    clientAppUrl: process.env.CLIENT_APP_URL,
    nodeEnv: process.env.NODE_ENV,
  });
});
