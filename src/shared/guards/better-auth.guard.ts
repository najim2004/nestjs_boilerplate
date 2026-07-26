import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '@/shared/decorators/public.decorator';
import { BetterAuthService } from '@/infrastructure/auth-provider/better-auth.config';
import { IUserContext } from '@/shared/interfaces/user-context.interface';

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
      const session = await this.betterAuthService.getSession(request);
      const sessionUser = session?.user as
        (IUserContext & { role?: string }) | undefined;

      if (!sessionUser) {
        throw new UnauthorizedException('Not authenticated');
      }

      // Attach user to request
      (request as Request & { user: IUserContext }).user = {
        id: sessionUser.id,
        email: sessionUser.email,
        name: sessionUser.name,
        role: sessionUser.role ?? 'user',
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
