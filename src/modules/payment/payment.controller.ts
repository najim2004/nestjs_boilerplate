import { Controller, Post, Body, Req, Headers } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentService } from './payment.service.js';
import { Public } from '@/shared/decorators/public.decorator.js';
import { Request } from 'express';

@ApiTags('payment')
@Controller('payment')
@ApiBearerAuth()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-intent')
  @ApiOperation({ summary: 'Create a payment intent' })
  async createIntent(@Body() body: { amount: number; currency?: string }) {
    const intent = await this.paymentService.createPaymentIntent(
      body.amount,
      body.currency,
    );
    return { clientSecret: intent.client_secret };
  }

  @Public()
  @Post('webhook')
  @ApiOperation({ summary: 'Stripe webhook endpoint' })
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    await Promise.resolve();
    if (!req.rawBody) {
      return { received: false };
    }
    const event = this.paymentService.constructWebhookEvent(
      req.rawBody,
      signature,
    );
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        // const paymentIntent = event.data.object;
        // console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
        break;
      default:
      // console.log(`Unhandled event type ${event.type}.`);
    }
    return { received: true };
  }
}
