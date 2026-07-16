import { Command, CommandRunner } from 'nest-commander';
import { Logger } from '@nestjs/common';

@Command({
  name: 'sample:task',
  description: 'A sample command line task',
})
export class SampleCommand extends CommandRunner {
  private readonly logger = new Logger(SampleCommand.name);

  async run(
    passedParam: string[],
    _options?: Record<string, unknown>,
  ): Promise<void> {
    void _options;
    await Promise.resolve();
    this.logger.log('Running sample command task with nest-commander...');
    this.logger.log(`Passed params: ${JSON.stringify(passedParam)}`);
    // Perform CLI operations here, such as running a heavy migration or script
    this.logger.log('Done.');
  }
}
