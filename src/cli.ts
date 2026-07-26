import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('CLI');
  try {
    await CommandFactory.run(AppModule, ['warn', 'error']);
    process.exit(0);
  } catch (error) {
    logger.error('Failed to run CLI command', error);
    process.exit(1);
  }
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
