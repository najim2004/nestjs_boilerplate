import { ApiProperty } from '@nestjs/swagger';

export class ApplicationFaqResponseDto {
  @ApiProperty({ example: 'faq_123abc', description: 'FAQ ID' })
  id!: string;

  @ApiProperty({
    example: 'How do I reset my password?',
    description: 'FAQ Question',
  })
  question!: string | null;

  @ApiProperty({
    example: 'Click on forgot password link on the login page.',
    description: 'FAQ Answer',
  })
  answer!: string | null;

  @ApiProperty({ example: 1, description: 'Sort order' })
  sortOrder!: number | null;
}
