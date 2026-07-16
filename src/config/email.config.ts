import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const emailConfigSchema = z.object({
  host: z.string().default('localhost'),
  port: z.coerce.number().default(1025),
  username: z.string().optional().default(''),
  password: z.string().optional().default(''),
  fromAddress: z.string().default('noreply@example.com'),
  fromName: z.string().default('NestJS Boilerplate'),
  secure: z
    .string()
    .transform((val) => val === 'true')
    .default(false),
});

export type EmailConfig = z.infer<typeof emailConfigSchema>;

export default registerAs('email', (): EmailConfig => {
  return emailConfigSchema.parse({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    username: process.env.MAIL_USERNAME,
    password: process.env.MAIL_PASSWORD,
    fromAddress: process.env.MAIL_FROM_ADDRESS,
    fromName: process.env.MAIL_FROM_NAME,
    secure: process.env.MAIL_SECURE,
  });
});
