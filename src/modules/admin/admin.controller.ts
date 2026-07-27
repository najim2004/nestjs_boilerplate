import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Roles } from '@/shared/decorators/roles.decorator';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { IUserContext } from '@/shared/interfaces/user-context.interface';
import { AdminService } from './admin.service';
import {
  CreateAdminContactDto,
  UpdateAdminContactDto,
  QueryAdminContactDto,
  AdminContactResponseDto,
} from './dtos/admin-contact.dto';
import {
  CreateAdminFaqDto,
  UpdateAdminFaqDto,
  AdminFaqResponseDto,
} from './dtos/admin-faq.dto';
import {
  CreateAdminNotificationDto,
  AdminNotificationResponseDto,
} from './dtos/admin-notification.dto';
import {
  QueryAdminPaymentTransactionDto,
  AdminPaymentTransactionResponseDto,
} from './dtos/admin-payment-transaction.dto';
import {
  QueryAdminUserDto,
  UpdateAdminUserDto,
  AdminUserResponseDto,
} from './dtos/admin-user.dto';
import {
  UpdateAdminWebsiteInfoDto,
  AdminWebsiteInfoResponseDto,
} from './dtos/admin-website-info.dto';
import { ApiResponseDto } from '@/shared/dtos/api-response.dto';

@ApiTags('admin')
@ApiBearerAuth()
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // --- Contact Management ---
  @Post('contact')
  @ApiOperation({ summary: 'Create contact entry (Admin)' })
  @ApiResponse({ status: 201, type: AdminContactResponseDto })
  async createContact(
    @Body() dto: CreateAdminContactDto,
  ): Promise<ApiResponseDto<AdminContactResponseDto>> {
    return this.adminService.createContact(dto);
  }

  @Get('contact')
  @ApiOperation({ summary: 'List contacts (Admin)' })
  @ApiResponse({ status: 200, type: [AdminContactResponseDto] })
  async findAllContacts(
    @Query() query: QueryAdminContactDto,
  ): Promise<ApiResponseDto<AdminContactResponseDto[]>> {
    return this.adminService.findAllContacts(query);
  }

  @Get('contact/:id')
  @ApiOperation({ summary: 'Get contact by ID (Admin)' })
  @ApiResponse({ status: 200, type: AdminContactResponseDto })
  async findOneContact(
    @Param('id') id: string,
  ): Promise<ApiResponseDto<AdminContactResponseDto>> {
    return this.adminService.findOneContact(id);
  }

  @Patch('contact/:id')
  @ApiOperation({ summary: 'Update contact entry (Admin)' })
  @ApiResponse({ status: 200, type: AdminContactResponseDto })
  async updateContact(
    @Param('id') id: string,
    @Body() dto: UpdateAdminContactDto,
  ): Promise<ApiResponseDto<AdminContactResponseDto>> {
    return this.adminService.updateContact(id, dto);
  }

  @Delete('contact/:id')
  @ApiOperation({ summary: 'Delete contact entry (Admin)' })
  @ApiResponse({ status: 200, description: 'Contact deleted successfully' })
  async removeContact(@Param('id') id: string): Promise<ApiResponseDto<null>> {
    return this.adminService.removeContact(id);
  }

  // --- FAQ Management ---
  @Post('faq')
  @ApiOperation({ summary: 'Create FAQ entry (Admin)' })
  @ApiResponse({ status: 201, type: AdminFaqResponseDto })
  async createFaq(
    @Body() dto: CreateAdminFaqDto,
  ): Promise<ApiResponseDto<AdminFaqResponseDto>> {
    return this.adminService.createFaq(dto);
  }

  @Get('faq')
  @ApiOperation({ summary: 'List all FAQs (Admin)' })
  @ApiResponse({ status: 200, type: [AdminFaqResponseDto] })
  async findAllFaqs(): Promise<ApiResponseDto<AdminFaqResponseDto[]>> {
    return this.adminService.findAllFaqs();
  }

  @Get('faq/:id')
  @ApiOperation({ summary: 'Get FAQ details (Admin)' })
  @ApiResponse({ status: 200, type: AdminFaqResponseDto })
  async findOneFaq(
    @Param('id') id: string,
  ): Promise<ApiResponseDto<AdminFaqResponseDto>> {
    return this.adminService.findOneFaq(id);
  }

  @Patch('faq/:id')
  @ApiOperation({ summary: 'Update FAQ entry (Admin)' })
  @ApiResponse({ status: 200, type: AdminFaqResponseDto })
  async updateFaq(
    @Param('id') id: string,
    @Body() dto: UpdateAdminFaqDto,
  ): Promise<ApiResponseDto<AdminFaqResponseDto>> {
    return this.adminService.updateFaq(id, dto);
  }

  @Delete('faq/:id')
  @ApiOperation({ summary: 'Delete FAQ entry (Admin)' })
  @ApiResponse({ status: 200, description: 'FAQ deleted successfully' })
  async removeFaq(@Param('id') id: string): Promise<ApiResponseDto<null>> {
    return this.adminService.removeFaq(id);
  }

  // --- Notification Management ---
  @Post('notification')
  @ApiOperation({ summary: 'Send system notification (Admin)' })
  @ApiResponse({ status: 201, type: AdminNotificationResponseDto })
  async sendNotification(
    @CurrentUser() user: IUserContext,
    @Body() dto: CreateAdminNotificationDto,
  ): Promise<ApiResponseDto<AdminNotificationResponseDto>> {
    return this.adminService.sendNotification(user.userId, dto);
  }

  // --- Payment Transactions ---
  @Get('payment-transaction')
  @ApiOperation({ summary: 'View payment transactions (Admin)' })
  @ApiResponse({ status: 200, type: [AdminPaymentTransactionResponseDto] })
  async findAllTransactions(
    @Query() query: QueryAdminPaymentTransactionDto,
  ): Promise<ApiResponseDto<AdminPaymentTransactionResponseDto[]>> {
    return this.adminService.findAllTransactions(query);
  }

  // --- User Management ---
  @Get('user')
  @ApiOperation({ summary: 'List all registered users (Admin)' })
  @ApiResponse({ status: 200, type: [AdminUserResponseDto] })
  async findAllUsers(
    @Query() query: QueryAdminUserDto,
  ): Promise<ApiResponseDto<AdminUserResponseDto[]>> {
    return this.adminService.findAllUsers(query);
  }

  @Patch('user/:id')
  @ApiOperation({ summary: 'Update user status or role (Admin)' })
  @ApiResponse({ status: 200, type: AdminUserResponseDto })
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateAdminUserDto,
  ): Promise<ApiResponseDto<AdminUserResponseDto>> {
    return this.adminService.updateUser(id, dto);
  }

  // --- Website Info Management ---
  @Get('website-info')
  @ApiOperation({ summary: 'Get website info settings (Admin)' })
  @ApiResponse({ status: 200, type: AdminWebsiteInfoResponseDto })
  async getWebsiteInfo(): Promise<ApiResponseDto<AdminWebsiteInfoResponseDto>> {
    return this.adminService.getWebsiteInfo();
  }

  @Patch('website-info')
  @ApiOperation({ summary: 'Update website info settings (Admin)' })
  @ApiResponse({ status: 200, type: AdminWebsiteInfoResponseDto })
  async updateWebsiteInfo(
    @Body() dto: UpdateAdminWebsiteInfoDto,
  ): Promise<ApiResponseDto<AdminWebsiteInfoResponseDto>> {
    return this.adminService.updateWebsiteInfo(dto);
  }
}
