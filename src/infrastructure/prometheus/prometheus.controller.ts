import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrometheusController as NestPrometheusController } from '@willsoto/nestjs-prometheus';
import { Public } from '@/shared/decorators/public.decorator.js';
import type { Response } from 'express';

@ApiTags('metrics')
@Controller('metrics')
@Public()
export class PrometheusController extends NestPrometheusController {
  @Get()
  @ApiOperation({ summary: 'Get Prometheus metrics' })
  async index(@Res({ passthrough: true }) response: Response) {
    return super.index(response);
  }
}
