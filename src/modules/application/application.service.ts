import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { Contact, Faq } from '../../../prisma/generated/client';
import {
  CreateApplicationContactDto,
  ApplicationContactResponseDto,
} from './dtos/application-contact.dto';
import { ApplicationFaqResponseDto } from './dtos/application-faq.dto';
import { ApplicationNotificationResponseDto } from './dtos/application-notification.dto';
import { ApiResponseDto } from '@/shared/dtos/api-response.dto';

@Injectable()
export class ApplicationService {
  constructor(private readonly prisma: PrismaService) {}

  // Contact submit
  async submitContact(
    dto: CreateApplicationContactDto,
  ): Promise<ApiResponseDto<ApplicationContactResponseDto>> {
    const contact: Contact = await this.prisma.contact.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phoneNumber: dto.phoneNumber,
        message: dto.message,
      },
    });

    return ApiResponseDto.ok(contact, 'Contact form submitted successfully');
  }

  // FAQ public list
  async getPublicFaqs(): Promise<ApiResponseDto<ApplicationFaqResponseDto[]>> {
    const faqs: Faq[] = await this.prisma.faq.findMany({
      where: { status: 1, deletedAt: null },
      select: {
        id: true,
        question: true,
        answer: true,
        sortOrder: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        status: true,
      },
      orderBy: { sortOrder: 'asc' },
    });

    return ApiResponseDto.ok(faqs, 'FAQs fetched successfully');
  }

  // Notifications for user
  async getUserNotifications(
    userId: string,
  ): Promise<ApiResponseDto<ApplicationNotificationResponseDto[]>> {
    const notifications = await this.prisma.notification.findMany({
      where: {
        receiverId: userId,
        deletedAt: null,
      },
      include: {
        notificationEvent: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted: ApplicationNotificationResponseDto[] = notifications.map(
      (n) => ({
        id: n.id,
        type: n.notificationEvent?.type ?? null,
        text: n.notificationEvent?.text ?? null,
        readAt: n.readAt,
        createdAt: n.createdAt,
      }),
    );

    return ApiResponseDto.ok(formatted, 'Notifications fetched successfully');
  }

  async markNotificationAsRead(
    userId: string,
    notificationId: string,
  ): Promise<ApiResponseDto<null>> {
    const notif = await this.prisma.notification.findFirst({
      where: { id: notificationId, receiverId: userId, deletedAt: null },
    });

    if (!notif) {
      throw new NotFoundException(
        `Notification with ID ${notificationId} not found`,
      );
    }

    await this.prisma.notification.update({
      where: { id: notificationId },
      data: { readAt: new Date() },
    });

    return ApiResponseDto.ok(null, 'Notification marked as read');
  }
}
