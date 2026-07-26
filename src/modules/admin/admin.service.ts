import { Injectable } from '@nestjs/common';
import { UserRepository } from '../users/user.repository';
import { PaginationDto } from '@/shared/dtos/pagination.dto';
import { IPaginatedResult } from '@/shared/interfaces/paginated-result.interface';
import { User } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUsers(
    paginationDto: PaginationDto,
  ): Promise<IPaginatedResult<User>> {
    return this.userRepository.paginate(
      paginationDto.page,
      paginationDto.limit,
      {},
      { createdAt: 'desc' },
    );
  }

  async getDashboardStats() {
    const totalUsers = await this.userRepository.count();

    return {
      totalUsers,
      activeUsers: totalUsers, // placeholder
    };
  }
}
