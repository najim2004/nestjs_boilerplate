import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaService } from '../database/prisma.service.js';
import { Request } from 'express';

@Injectable()
export class BetterAuthService {
  private readonly logger = new Logger(BetterAuthService.name);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly auth: any;

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    const secret = this.configService.get<string>('auth.secret');
    const baseURL = this.configService.get<string>('auth.url');

    if (!secret) {
      throw new Error('BETTER_AUTH_SECRET is not defined');
    }

    this.auth = betterAuth({
      database: prismaAdapter(this.prismaService, {
        provider: 'postgresql',
      }),
      emailAndPassword: {
        enabled: true,
      },
      secret,
      baseURL,
      // You can add social providers here
      // socialProviders: {
      //   google: {
      //     clientId: process.env.GOOGLE_CLIENT_ID,
      //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      //   }
      // }
    });

    this.logger.log('BetterAuth configured successfully');
  }

  async getSession(req: Request) {
    return await this.auth.api.getSession({
      headers: req.headers as Record<string, string>,
    });
  }
}
