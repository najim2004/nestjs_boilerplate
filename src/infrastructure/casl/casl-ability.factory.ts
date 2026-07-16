import { Injectable } from '@nestjs/common';
import { AbilityBuilder, MongoAbility } from '@casl/ability';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import { User } from '../../../prisma/generated/client.js';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type AppAbility = MongoAbility<
  [Action, Subjects<{ User: User }> | 'all'],
  PrismaQuery
>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: { id: string; role?: string }) {
    const { can, build } = new AbilityBuilder<AppAbility>(createPrismaAbility);

    if (user.role === 'admin') {
      can(Action.Manage, 'all'); // read-write access to everything
    } else {
      can(Action.Read, 'all'); // read-only access to everything
      can(Action.Update, 'User', { id: user.id }); // update own profile
    }

    return build();
  }
}
