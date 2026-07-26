import type { IStorageAdapter } from '../storage.interface';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

export class S3StorageStrategy implements IStorageAdapter {
  private s3Client: S3Client;
  private bucket: string;

  constructor(private configService: ConfigService) {
    this.bucket =
      this.configService.get<string>('storage.s3Bucket') || 'my-bucket';
    this.s3Client = new S3Client({
      region: this.configService.get<string>('storage.s3Region') || 'us-east-1',
      credentials: {
        accessKeyId:
          this.configService.get<string>('storage.s3AccessKey') || '',
        secretAccessKey:
          this.configService.get<string>('storage.s3SecretKey') || '',
      },
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    directory = 'uploads',
  ): Promise<string> {
    const key = `${directory}/${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    });

    await this.s3Client.send(command);

    const region = await this.s3Client.config.region();
    return `https://${this.bucket}.s3.${region}.amazonaws.com/${key}`;
  }

  async deleteFile(_fileUrl: string): Promise<void> {
    await Promise.resolve();
    void _fileUrl;
    // Logic to parse fileUrl and delete from S3
  }

  getFileUrl(key: string): string {
    return `https://${this.bucket}.s3.amazonaws.com/${key}`;
  }
}
