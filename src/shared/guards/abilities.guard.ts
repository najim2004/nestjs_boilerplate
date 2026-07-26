import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import {
  AppAbility,
  CaslAbilityFactory,
} from '@/infrastructure/casl/casl-ability.factory';
import { IUserContext } from '@/shared/interfaces/user-context.interface';
import {
  CHECK_ABILITY,
  RequiredRule,
} from '../decorators/check-abilities.decorator';

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

    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: IUserContext }>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User is not authenticated');
    }

    const ability = this.caslAbilityFactory.createForUser(user);

    for (const rule of rules) {
      const subject = rule.subject as Parameters<AppAbility['can']>[1];
      if (!ability.can(rule.action, subject)) {
        throw new ForbiddenException(
          `You are not allowed to ${rule.action} this resource`,
        );
      }
    }

    return true;
  }
}
