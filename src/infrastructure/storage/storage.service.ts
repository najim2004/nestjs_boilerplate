import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IStorageAdapter } from './storage.interface';
import { LocalStorageStrategy } from './strategies/local.strategy';

@Injectable()
export class StorageService {
  private readonly strategy: IStorageAdapter;

  constructor(
    private readonly configService: ConfigService,
    private readonly localStrategy: LocalStorageStrategy,
    // Inject S3 strategy here when implemented
  ) {
    const driver = this.configService.get<string>('storage.driver');

    if (driver === 's3') {
      // this.strategy = this.s3Strategy;
      // Fallback for now
      this.strategy = this.localStrategy;
    } else {
      this.strategy = this.localStrategy;
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    directory?: string,
  ): Promise<string> {
    return this.strategy.uploadFile(file, directory);
  }

  async deleteFile(url: string): Promise<void> {
    return this.strategy.deleteFile(url);
  }

  getFileUrl(key: string): string {
    return this.strategy.getFileUrl(key);
  }
}
