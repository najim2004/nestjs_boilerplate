import {
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service.js';
import { RolesGuard } from '@/shared/guards/roles.guard.js';
import { Roles } from '@/shared/decorators/roles.decorator.js';
import { UserRole } from '@/shared/enums/user-role.enum.js';
import { PaginationDto } from '@/shared/dtos/pagination.dto.js';
import { ApiPagination } from '@/shared/decorators/api-pagination.decorator.js';
import { TransformInterceptor } from '@/shared/interceptors/transform.interceptor.js';

@ApiTags('admin')
@Controller('admin')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
@UseInterceptors(TransformInterceptor)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @ApiOperation({ summary: 'Get all users (paginated)' })
  @ApiPagination()
  async getUsers(@Query() paginationDto: PaginationDto) {
    return this.adminService.getUsers(paginationDto);
  }

  @Get('dashboard/stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }
}
