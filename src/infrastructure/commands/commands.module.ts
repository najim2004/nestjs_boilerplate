import { Module } from '@nestjs/common';
import { SampleCommand } from './sample.command.js';

@Module({
  providers: [SampleCommand],
})
export class CommandsModule {}
