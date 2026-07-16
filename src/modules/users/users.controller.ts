import { Controller, Get, Put, Body, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service.js';
import { CurrentUser } from '@/shared/decorators/current-user.decorator.js';
import type { IUserContext } from '@/shared/interfaces/user-context.interface.js';
import { UpdateUserDto } from './dtos/update-user.dto.js';
import { TransformInterceptor } from '@/shared/interceptors/transform.interceptor.js';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
@UseInterceptors(TransformInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@CurrentUser() user: IUserContext) {
    return this.usersService.getProfile(user.id);
  }

  @Put('me')
  @ApiOperation({ summary: 'Update current user profile' })
  async updateProfile(
    @CurrentUser() user: IUserContext,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(user.id, updateUserDto);
  }
}
