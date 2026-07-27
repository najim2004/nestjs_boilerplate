import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePaymentIntentDto {
  @ApiProperty({
    example: 4999,
    description: 'Amount in cents (e.g. 4999 for $49.99)',
  })
  @IsNumber()
  @Min(1)
  amount!: number;

  @ApiPropertyOptional({
    example: 'usd',
    description: '3-letter ISO currency code',
  })
  @IsOptional()
  @IsString()
  currency?: string;
}

export class CreateCheckoutSessionDto {
  @ApiProperty({ example: 4999, description: 'Amount in cents' })
  @IsNumber()
  @Min(1)
  amount!: number;

  @ApiProperty({
    example: 'Premium Subscription Plan',
    description: 'Product title / description',
  })
  @IsString()
  productName!: string;

  @ApiProperty({
    example: 'https://example.com/success',
    description: 'Success redirect URL',
  })
  @IsString()
  successUrl!: string;

  @ApiProperty({
    example: 'https://example.com/cancel',
    description: 'Cancel redirect URL',
  })
  @IsString()
  cancelUrl!: string;
}

export class PaymentIntentResponseDto {
  @ApiProperty({
    example: 'pi_3MtwBwLkdIwHu7ix0rZXBm5e',
    description: 'Stripe PaymentIntent ID',
  })
  id!: string;

  @ApiProperty({
    example: 'pi_3MtwBwLkdIwHu7ix0rZXBm5e_secret_123',
    description: 'Client secret for Stripe Elements',
  })
  clientSecret!: string | null;

  @ApiProperty({ example: 4999, description: 'Amount' })
  amount!: number;

  @ApiProperty({ example: 'usd', description: 'Currency' })
  currency!: string;

  @ApiProperty({
    example: 'requires_payment_method',
    description: 'Intent status',
  })
  status!: string;
}

export class CheckoutSessionResponseDto {
  @ApiProperty({
    example: 'cs_test_a1b2c3d4e5',
    description: 'Stripe Checkout Session ID',
  })
  id!: string;

  @ApiProperty({
    example: 'https://checkout.stripe.com/c/pay/cs_test_a1b2c3d4e5',
    description: 'Stripe Checkout URL',
  })
  url!: string | null;
}

export class WebhookResponseDto {
  @ApiProperty({ example: true, description: 'Webhook receipt status' })
  received!: boolean;
}
