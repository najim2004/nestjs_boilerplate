import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import {
  Contact,
  Faq,
  Notification,
  NotificationEvent,
  PaymentTransaction,
  User,
  WebsiteInfo,
} from '../../../prisma/generated/client';
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

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // ================= ADMIN CONTACT MANAGEMENT =================
  async createContact(
    dto: CreateAdminContactDto,
  ): Promise<ApiResponseDto<AdminContactResponseDto>> {
    const contact: Contact = await this.prisma.contact.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phoneNumber: dto.phoneNumber,
        message: dto.message,
      },
    });
    return ApiResponseDto.ok(contact, 'Contact created successfully');
  }

  async findAllContacts(
    query: QueryAdminContactDto,
  ): Promise<ApiResponseDto<AdminContactResponseDto[]>> {
    const where = query.q
      ? {
          OR: [
            { firstName: { contains: query.q, mode: 'insensitive' as const } },
            { lastName: { contains: query.q, mode: 'insensitive' as const } },
            { email: { contains: query.q, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const contacts: Contact[] = await this.prisma.contact.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return ApiResponseDto.ok(contacts, 'Contacts fetched successfully');
  }

  async findOneContact(
    id: string,
  ): Promise<ApiResponseDto<AdminContactResponseDto>> {
    const contact: Contact | null = await this.prisma.contact.findUnique({
      where: { id },
    });
    if (!contact)
      throw new NotFoundException(`Contact with ID ${id} not found`);
    return ApiResponseDto.ok(contact, 'Contact details fetched successfully');
  }

  async updateContact(
    id: string,
    dto: UpdateAdminContactDto,
  ): Promise<ApiResponseDto<AdminContactResponseDto>> {
    await this.findOneContact(id);
    const updated: Contact = await this.prisma.contact.update({
      where: { id },
      data: dto,
    });
    return ApiResponseDto.ok(updated, 'Contact updated successfully');
  }

  async removeContact(id: string): Promise<ApiResponseDto<null>> {
    await this.findOneContact(id);
    await this.prisma.contact.delete({ where: { id } });
    return ApiResponseDto.ok(null, 'Contact deleted successfully');
  }

  // ================= ADMIN FAQ MANAGEMENT =================
  async createFaq(
    dto: CreateAdminFaqDto,
  ): Promise<ApiResponseDto<AdminFaqResponseDto>> {
    const faq: Faq = await this.prisma.faq.create({
      data: {
        question: dto.question,
        answer: dto.answer,
        status: dto.status ?? 1,
        sortOrder: dto.sortOrder ?? 0,
      },
    });
    return ApiResponseDto.ok(faq, 'FAQ created successfully');
  }

  async findAllFaqs(): Promise<ApiResponseDto<AdminFaqResponseDto[]>> {
    const faqs: Faq[] = await this.prisma.faq.findMany({
      where: { deletedAt: null },
      orderBy: { sortOrder: 'asc' },
    });
    return ApiResponseDto.ok(faqs, 'FAQs fetched successfully');
  }

  async findOneFaq(id: string): Promise<ApiResponseDto<AdminFaqResponseDto>> {
    const faq: Faq | null = await this.prisma.faq.findFirst({
      where: { id, deletedAt: null },
    });
    if (!faq) throw new NotFoundException(`FAQ with ID ${id} not found`);
    return ApiResponseDto.ok(faq, 'FAQ details fetched successfully');
  }

  async updateFaq(
    id: string,
    dto: UpdateAdminFaqDto,
  ): Promise<ApiResponseDto<AdminFaqResponseDto>> {
    await this.findOneFaq(id);
    const updated: Faq = await this.prisma.faq.update({
      where: { id },
      data: dto,
    });
    return ApiResponseDto.ok(updated, 'FAQ updated successfully');
  }

  async removeFaq(id: string): Promise<ApiResponseDto<null>> {
    await this.findOneFaq(id);
    await this.prisma.faq.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return ApiResponseDto.ok(null, 'FAQ deleted successfully');
  }

  // ================= ADMIN NOTIFICATIONS =================
  async sendNotification(
    senderId: string,
    dto: CreateAdminNotificationDto,
  ): Promise<ApiResponseDto<AdminNotificationResponseDto>> {
    const event: NotificationEvent = await this.prisma.notificationEvent.create(
      {
        data: {
          type: dto.type,
          text: dto.text,
        },
      },
    );

    const notification: Notification = await this.prisma.notification.create({
      data: {
        senderId,
        receiverId: dto.receiverId,
        notificationEventId: event.id,
        entityId: dto.entityId,
      },
    });

    return ApiResponseDto.ok(
      {
        id: notification.id,
        type: event.type,
        text: event.text,
        senderId: notification.senderId,
        receiverId: notification.receiverId,
        status: notification.status,
        createdAt: notification.createdAt,
      },
      'Notification sent successfully',
    );
  }

  // ================= ADMIN PAYMENT TRANSACTIONS =================
  async findAllTransactions(
    query: QueryAdminPaymentTransactionDto,
  ): Promise<ApiResponseDto<AdminPaymentTransactionResponseDto[]>> {
    const where: { userId?: string; status?: string } = {};
    if (query.userId) where.userId = query.userId;
    if (query.status) where.status = query.status;

    const txns: PaymentTransaction[] =
      await this.prisma.paymentTransaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

    const formatted: AdminPaymentTransactionResponseDto[] = txns.map((t) => ({
      id: t.id,
      userId: t.userId,
      orderId: t.orderId,
      provider: t.provider,
      referenceNumber: t.referenceNumber,
      status: t.status,
      amount: t.amount ? Number(t.amount) : null,
      currency: t.currency,
      createdAt: t.createdAt,
    }));

    return ApiResponseDto.ok(
      formatted,
      'Payment transactions fetched successfully',
    );
  }

  // ================= ADMIN USER MANAGEMENT =================
  async findAllUsers(
    query: QueryAdminUserDto,
  ): Promise<ApiResponseDto<AdminUserResponseDto[]>> {
    const where = {
      ...(query.q
        ? {
            OR: [
              { name: { contains: query.q, mode: 'insensitive' as const } },
              { email: { contains: query.q, mode: 'insensitive' as const } },
            ],
          }
        : {}),
      ...(query.status !== undefined ? { status: query.status } : {}),
      deletedAt: null,
    };

    const users: User[] = await this.prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const formatted: AdminUserResponseDto[] = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
      phoneNumber: u.phoneNumber,
      createdAt: u.createdAt,
    }));

    return ApiResponseDto.ok(formatted, 'Users fetched successfully');
  }

  async updateUser(
    id: string,
    dto: UpdateAdminUserDto,
  ): Promise<ApiResponseDto<AdminUserResponseDto>> {
    const user: User | null = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    const updated: User = await this.prisma.user.update({
      where: { id },
      data: dto,
    });

    return ApiResponseDto.ok(
      {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        status: updated.status,
        phoneNumber: updated.phoneNumber,
        createdAt: updated.createdAt,
      },
      'User updated successfully',
    );
  }

  // ================= ADMIN WEBSITE INFO =================
  async getWebsiteInfo(): Promise<ApiResponseDto<AdminWebsiteInfoResponseDto>> {
    let info: WebsiteInfo | null = await this.prisma.websiteInfo.findFirst();
    if (!info) {
      info = await this.prisma.websiteInfo.create({
        data: {
          name: 'My Boilerplate App',
        },
      });
    }
    return ApiResponseDto.ok(info, 'Website info fetched successfully');
  }

  async updateWebsiteInfo(
    dto: UpdateAdminWebsiteInfoDto,
  ): Promise<ApiResponseDto<AdminWebsiteInfoResponseDto>> {
    let info: WebsiteInfo | null = await this.prisma.websiteInfo.findFirst();
    if (!info) {
      info = await this.prisma.websiteInfo.create({ data: dto });
    } else {
      info = await this.prisma.websiteInfo.update({
        where: { id: info.id },
        data: dto,
      });
    }
    return ApiResponseDto.ok(info, 'Website info updated successfully');
  }
}
