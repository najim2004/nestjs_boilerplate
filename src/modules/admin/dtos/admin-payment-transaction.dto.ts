import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryAdminPaymentTransactionDto {
  @ApiPropertyOptional({
    example: 'usr_123abc',
    description: 'Filter by user ID',
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({
    example: 'completed',
    description: 'Filter by status (pending, completed, failed)',
  })
  @IsOptional()
  @IsString()
  status?: string;
}

export class AdminPaymentTransactionResponseDto {
  @ApiProperty({ example: 'txn_123abc', description: 'Transaction ID' })
  id!: string;

  @ApiProperty({ example: 'usr_123abc', description: 'User ID' })
  userId!: string | null;

  @ApiProperty({ example: 'ord_999', description: 'Order ID' })
  orderId!: string | null;

  @ApiProperty({ example: 'stripe', description: 'Payment Provider' })
  provider!: string | null;

  @ApiProperty({ example: 'ref_000123', description: 'Reference Number' })
  referenceNumber!: string | null;

  @ApiProperty({ example: 'completed', description: 'Status' })
  status!: string | null;

  @ApiProperty({ example: 49.99, description: 'Amount' })
  amount!: number | null;

  @ApiProperty({ example: 'USD', description: 'Currency' })
  currency!: string | null;

  @ApiProperty({
    example: '2026-07-27T10:00:00.000Z',
    description: 'Created timestamp',
  })
  createdAt!: Date;
}
