import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { join } from 'path';
import { AllExceptionsFilter } from '@/shared/filters/all-exceptions.filter.js';

export function bootstrap(app: NestExpressApplication): void {
  // Global prefix
  app.setGlobalPrefix('api');

  // CORS
  app.enableCors({
    origin: process.env.CLIENT_APP_URL ?? 'http://localhost:3000',
    credentials: true,
  });

  // Security headers
  app.use(helmet());

  // Static assets
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    index: false,
    prefix: '/public',
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());
}
