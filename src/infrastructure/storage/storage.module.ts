import { Global, Module } from '@nestjs/common';
import { StorageService } from './storage.service.js';
import { LocalStorageStrategy } from './strategies/local.strategy.js';

@Global()
@Module({
  providers: [StorageService, LocalStorageStrategy],
  exports: [StorageService],
})
export class StorageModule {}
