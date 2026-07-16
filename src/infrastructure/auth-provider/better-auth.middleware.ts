import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { BetterAuthService } from './better-auth.config.js';
import { toNodeHandler } from 'better-auth/node';

@Injectable()
export class BetterAuthMiddleware implements NestMiddleware {
  constructor(private readonly betterAuthService: BetterAuthService) {}

  use(req: Request, res: Response, next: NextFunction) {
    if (req.path.startsWith('/api/auth')) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const handler = toNodeHandler(this.betterAuthService.auth);
      return handler(req, res);
    }
    next();
  }
}
