import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository.js';
import { UpdateUserDto } from './dtos/update-user.dto.js';
import { User } from '../../../prisma/generated/client.js';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async getProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateProfile(userId: string, data: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userRepository.update(userId, {
      ...(data.name && { name: data.name }),
    });
  }
}
