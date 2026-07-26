import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@/infrastructure/database/base.repository';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { User } from '../../../prisma/generated/client';

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
