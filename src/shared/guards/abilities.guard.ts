import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from '@/infrastructure/casl/casl-ability.factory.js';
import {
  CHECK_ABILITY,
  RequiredRule,
} from '../decorators/check-abilities.decorator.js';

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const rules = this.reflector.get<RequiredRule[]>(
      CHECK_ABILITY,
      context.getHandler(),
    );
    if (!rules) {
      return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User is not authenticated');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const ability = this.caslAbilityFactory.createForUser(user);

    for (const rule of rules) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
      if (!ability.can(rule.action, rule.subject as any)) {
        throw new ForbiddenException(
          `You are not allowed to ${rule.action} this resource`,
        );
      }
    }

    return true;
  }
}
