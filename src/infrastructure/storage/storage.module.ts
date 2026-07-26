import { Global, Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { LocalStorageStrategy } from './strategies/local.strategy';

@Global()
@Module({
  providers: [StorageService, LocalStorageStrategy],
  exports: [StorageService],
})
export class StorageModule {}
