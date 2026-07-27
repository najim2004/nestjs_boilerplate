import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import Stripe from 'stripe';
import {
  CreatePaymentIntentDto,
  CreateCheckoutSessionDto,
  PaymentIntentResponseDto,
  CheckoutSessionResponseDto,
  WebhookResponseDto,
} from './dtos/payment.dto';
import { ApiResponseDto } from '@/shared/dtos/api-response.dto';

@Injectable()
export class PaymentService {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const secretKey =
      this.configService.get<string>('payment.stripeSecretKey') || '';
    this.stripe = new Stripe(secretKey);
  }

  async createPaymentIntent(
    userId: string,
    dto: CreatePaymentIntentDto,
  ): Promise<ApiResponseDto<PaymentIntentResponseDto>> {
    try {
      const intent = await this.stripe.paymentIntents.create({
        amount: dto.amount,
        currency: dto.currency || 'usd',
        metadata: { userId },
      });

      // Record pending transaction in DB
      await this.prisma.paymentTransaction.create({
        data: {
          userId,
          referenceNumber: intent.id,
          provider: 'stripe',
          status: 'pending',
          rawStatus: intent.status,
          amount: dto.amount / 100,
          currency: intent.currency,
        },
      });

      const response: PaymentIntentResponseDto = {
        id: intent.id,
        clientSecret: intent.client_secret,
        amount: intent.amount,
        currency: intent.currency,
        status: intent.status,
      };

      return ApiResponseDto.ok(response, 'Payment intent created successfully');
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error('Error creating payment intent', err);
      throw new BadRequestException(
        err.message || 'Failed to create payment intent',
      );
    }
  }

  async createCheckoutSession(
    userId: string,
    dto: CreateCheckoutSessionDto,
  ): Promise<ApiResponseDto<CheckoutSessionResponseDto>> {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: dto.productName,
              },
              unit_amount: dto.amount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: dto.successUrl,
        cancel_url: dto.cancelUrl,
        metadata: { userId },
      });

      const response: CheckoutSessionResponseDto = {
        id: session.id,
        url: session.url,
      };

      return ApiResponseDto.ok(
        response,
        'Checkout session created successfully',
      );
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error('Error creating checkout session', err);
      throw new BadRequestException(
        err.message || 'Failed to create checkout session',
      );
    }
  }

  constructWebhookEvent(
    payload: string | Buffer,
    signature: string,
  ): Stripe.Event {
    const webhookSecret =
      this.configService.get<string>('payment.stripeWebhookSecret') || '';
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );
  }

  async handleStripeEvent(event: Stripe.Event): Promise<WebhookResponseDto> {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        await this.prisma.paymentTransaction.updateMany({
          where: { referenceNumber: paymentIntent.id },
          data: {
            status: 'succeeded',
            rawStatus: paymentIntent.status,
            paidAmount: paymentIntent.amount / 100,
            paidCurrency: paymentIntent.currency,
          },
        });
        break;
      }
      case 'payment_intent.payment_failed': {
        const failedIntent = event.data.object;
        await this.prisma.paymentTransaction.updateMany({
          where: { referenceNumber: failedIntent.id },
          data: {
            status: 'failed',
            rawStatus: failedIntent.status,
          },
        });
        break;
      }
      case 'payment_intent.canceled': {
        const canceledIntent = event.data.object;
        await this.prisma.paymentTransaction.updateMany({
          where: { referenceNumber: canceledIntent.id },
          data: {
            status: 'canceled',
            rawStatus: canceledIntent.status,
          },
        });
        break;
      }
      default:
        this.logger.log(`Unhandled Stripe event type: ${event.type}`);
    }

    return { received: true };
  }
}
