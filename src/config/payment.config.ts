import { z } from 'zod';
import { registerAs } from '@nestjs/config';

export const paymentConfigSchema = z.object({
  stripeSecretKey: z.string().default('sk_test_...'),
  stripeWebhookSecret: z.string().default('whsec_...'),
});

export type PaymentConfig = z.infer<typeof paymentConfigSchema>;

export default registerAs('payment', () => {
  const parsed = paymentConfigSchema.safeParse({
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  });
  if (!parsed.success) {
    throw new Error(`Invalid payment config: ${parsed.error.message}`);
  }
  return parsed.data;
});
