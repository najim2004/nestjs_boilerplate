import { Module } from '@nestjs/common';
import { PrometheusModule as NestPrometheusModule } from '@willsoto/nestjs-prometheus';
import { PrometheusController } from './prometheus.controller';

@Module({
  imports: [
    NestPrometheusModule.register({
      path: '/metrics',
      defaultMetrics: {
        enabled: true,
      },
    }),
  ],
  controllers: [PrometheusController],
})
export class PrometheusModule {}
