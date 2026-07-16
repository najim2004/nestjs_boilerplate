import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const storageConfigSchema = z.object({
  driver: z.enum(['local', 's3']).default('local'),
  localRoot: z.string().default('./public/storage'),
  awsAccessKeyId: z.string().optional().default(''),
  awsSecretAccessKey: z.string().optional().default(''),
  awsDefaultRegion: z.string().optional().default(''),
  awsBucket: z.string().optional().default(''),
  awsEndpoint: z.string().optional().default(''),
});

export type StorageConfig = z.infer<typeof storageConfigSchema>;

export default registerAs('storage', (): StorageConfig => {
  return storageConfigSchema.parse({
    driver: process.env.STORAGE_DRIVER,
    localRoot: process.env.STORAGE_LOCAL_ROOT,
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsDefaultRegion: process.env.AWS_DEFAULT_REGION,
    awsBucket: process.env.AWS_BUCKET,
    awsEndpoint: process.env.AWS_ENDPOINT,
  });
});
