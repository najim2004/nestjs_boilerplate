import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(PaymentService.name);

  constructor(private configService: ConfigService) {
    const secretKey = this.configService.get<string>('payment.stripeSecretKey');
    this.stripe = new Stripe(secretKey || '');
  }

  async createPaymentIntent(amount: number, currency = 'usd') {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency,
      });
      return paymentIntent;
    } catch (error) {
      this.logger.error('Error creating payment intent', error);
      throw error;
    }
  }

  constructWebhookEvent(payload: string | Buffer, signature: string) {
    const webhookSecret = this.configService.get<string>(
      'payment.stripeWebhookSecret',
    );
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret || '',
    );
  }
}
