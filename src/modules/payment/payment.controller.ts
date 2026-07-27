import { Controller, Post, Body, Req, Headers } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { Public } from '@/shared/decorators/public.decorator';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { IUserContext } from '@/shared/interfaces/user-context.interface';
import { Request } from 'express';
import {
  CreatePaymentIntentDto,
  CreateCheckoutSessionDto,
  PaymentIntentResponseDto,
  CheckoutSessionResponseDto,
  WebhookResponseDto,
} from './dtos/payment.dto';
import { ApiResponseDto } from '@/shared/dtos/api-response.dto';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiBearerAuth()
  @Post('create-intent')
  @ApiOperation({ summary: 'Create a Stripe payment intent' })
  @ApiResponse({ status: 201, type: PaymentIntentResponseDto })
  async createIntent(
    @CurrentUser() user: IUserContext,
    @Body() dto: CreatePaymentIntentDto,
  ): Promise<ApiResponseDto<PaymentIntentResponseDto>> {
    return this.paymentService.createPaymentIntent(user.userId, dto);
  }

  @ApiBearerAuth()
  @Post('checkout-session')
  @ApiOperation({ summary: 'Create a Stripe checkout session' })
  @ApiResponse({ status: 201, type: CheckoutSessionResponseDto })
  async createCheckoutSession(
    @CurrentUser() user: IUserContext,
    @Body() dto: CreateCheckoutSessionDto,
  ): Promise<ApiResponseDto<CheckoutSessionResponseDto>> {
    return this.paymentService.createCheckoutSession(user.userId, dto);
  }

  @Public()
  @Post('webhook')
  @ApiOperation({ summary: 'Stripe webhook listener' })
  @ApiResponse({ status: 200, type: WebhookResponseDto })
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ): Promise<WebhookResponseDto> {
    if (!req.rawBody) {
      return { received: false };
    }
    const event = this.paymentService.constructWebhookEvent(
      req.rawBody,
      signature,
    );
    return this.paymentService.handleStripeEvent(event);
  }
}
