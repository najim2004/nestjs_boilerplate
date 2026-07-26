import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { bootstrap } from './bootstrap/bootstrap';
import { setupSwagger } from './bootstrap/swagger.setup';

async function start(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  bootstrap(app);
  setupSwagger(app);

  const port = process.env.PORT ?? 4000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}

void start();
