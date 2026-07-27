import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Public } from '@/shared/decorators/public.decorator';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { IUserContext } from '@/shared/interfaces/user-context.interface';
import { ApplicationService } from './application.service';
import {
  CreateApplicationContactDto,
  ApplicationContactResponseDto,
} from './dtos/application-contact.dto';
import { ApplicationFaqResponseDto } from './dtos/application-faq.dto';
import { ApplicationNotificationResponseDto } from './dtos/application-notification.dto';
import { ApiResponseDto } from '@/shared/dtos/api-response.dto';

@ApiTags('application')
@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Public()
  @Post('contact')
  @ApiOperation({ summary: 'Submit public contact form' })
  @ApiResponse({ status: 201, type: ApplicationContactResponseDto })
  async submitContact(
    @Body() dto: CreateApplicationContactDto,
  ): Promise<ApiResponseDto<ApplicationContactResponseDto>> {
    return this.applicationService.submitContact(dto);
  }

  @Public()
  @Get('faq')
  @ApiOperation({ summary: 'Get published FAQs' })
  @ApiResponse({ status: 200, type: [ApplicationFaqResponseDto] })
  async getPublicFaqs(): Promise<ApiResponseDto<ApplicationFaqResponseDto[]>> {
    return this.applicationService.getPublicFaqs();
  }

  @ApiBearerAuth()
  @Get('notification')
  @ApiOperation({ summary: 'Get current user notifications' })
  @ApiResponse({ status: 200, type: [ApplicationNotificationResponseDto] })
  async getUserNotifications(
    @CurrentUser() user: IUserContext,
  ): Promise<ApiResponseDto<ApplicationNotificationResponseDto[]>> {
    return this.applicationService.getUserNotifications(user.userId);
  }

  @ApiBearerAuth()
  @Patch('notification/:id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  async markNotificationAsRead(
    @CurrentUser() user: IUserContext,
    @Param('id') id: string,
  ): Promise<ApiResponseDto<null>> {
    return this.applicationService.markNotificationAsRead(user.userId, id);
  }
}
