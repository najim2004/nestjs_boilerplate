import {
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { RolesGuard } from '@/shared/guards/roles.guard';
import { Roles } from '@/shared/decorators/roles.decorator';
import { UserRole } from '@/shared/enums/user-role.enum';
import { PaginationDto } from '@/shared/dtos/pagination.dto';
import { ApiPagination } from '@/shared/decorators/api-pagination.decorator';
import { TransformInterceptor } from '@/shared/interceptors/transform.interceptor';

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
