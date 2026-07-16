import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const websocketConfigSchema = z.object({
  port: z.coerce.number().default(4000),
  corsOrigin: z.string().default('http://localhost:3000'),
});

export type WebsocketConfig = z.infer<typeof websocketConfigSchema>;

export default registerAs('websocket', (): WebsocketConfig => {
  return websocketConfigSchema.parse({
    port: process.env.WS_PORT,
    corsOrigin: process.env.WS_CORS_ORIGIN,
  });
});
