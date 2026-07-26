import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { IStorageAdapter } from '../storage.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LocalStorageStrategy implements IStorageAdapter {
  private readonly logger = new Logger(LocalStorageStrategy.name);
  private readonly rootDir: string;

  constructor(private readonly configService: ConfigService) {
    this.rootDir = this.configService.get<string>(
      'storage.localRoot',
      './public/storage',
    );
  }

  async uploadFile(
    file: Express.Multer.File,
    directory = 'uploads',
  ): Promise<string> {
    const targetDir = path.join(this.rootDir, directory);
    await fs.mkdir(targetDir, { recursive: true });

    const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    const targetPath = path.join(targetDir, filename);

    await fs.writeFile(targetPath, file.buffer);

    // Return relative URL path
    return `/${directory}/${filename}`;
  }

  async deleteFile(url: string): Promise<void> {
    try {
      const relativePath = url.startsWith('/') ? url.slice(1) : url;
      const targetPath = path.join(this.rootDir, relativePath);
      await fs.unlink(targetPath);
    } catch (error) {
      this.logger.error(`Failed to delete file: ${url}`, error);
    }
  }

  getFileUrl(key: string): string {
    const relativePath = key.startsWith('/') ? key : `/${key}`;
    return `/public/storage${relativePath}`;
  }
}
