import { Module } from '@nestjs/common';
import { SampleCommand } from './sample.command';

@Module({
  providers: [SampleCommand],
})
export class CommandsModule {}
