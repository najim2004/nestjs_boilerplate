import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { IUserContext } from '@/shared/interfaces/user-context.interface.js';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): IUserContext | null => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return (request as Request & { user?: IUserContext }).user ?? null;
  },
);
