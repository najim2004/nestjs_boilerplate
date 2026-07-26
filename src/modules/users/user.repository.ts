import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@/infrastructure/database/base.repository.js';
import { PrismaService } from '@/infrastructure/database/prisma.service.js';
import { User } from '../../../prisma/generated/client.js';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(prisma: PrismaService) {
    super(
      prisma,
      prisma.user as unknown as BaseRepository<User>['modelDelegate'],
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
