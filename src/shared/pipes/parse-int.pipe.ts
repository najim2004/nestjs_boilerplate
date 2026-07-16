import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class CustomParseIntPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    const parsed = parseInt(value, 10);

    if (isNaN(parsed)) {
      throw new BadRequestException(
        `Validation failed. "${value}" is not a valid integer.`,
      );
    }

    return parsed;
  }
}
