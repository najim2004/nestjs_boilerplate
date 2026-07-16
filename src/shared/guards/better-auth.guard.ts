import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '@/shared/decorators/public.decorator.js';
import { BetterAuthService } from '@/infrastructure/auth-provider/better-auth.config.js';
import { IUserContext } from '@/shared/interfaces/user-context.interface.js';

@Injectable()
export class BetterAuthGuard implements CanActivate {
  private readonly logger = new Logger(BetterAuthGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly betterAuthService: BetterAuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const session = await this.betterAuthService.getSession(request);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (!session?.user) {
        throw new UnauthorizedException('Not authenticated');
      }

      // Attach user to request
      (request as Request & { user: IUserContext }).user = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        id: session.user.id,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        email: session.user.email,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        name: session.user.name,
        role:
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          ((session.user as Record<string, unknown>).role as string) ?? 'user',
      };

      return true;
    } catch (error) {
      this.logger.debug(
        'Authentication failed',
        error instanceof Error ? error.message : 'Unknown error',
      );
      throw new UnauthorizedException('Not authenticated');
    }
  }
}
