import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import {
  CreateConversationDto,
  ConversationResponseDto,
} from './dtos/chat-conversation.dto';
import {
  SendChatMessageDto,
  ChatMessageResponseDto,
} from './dtos/chat-message.dto';
import {
  QueryChatUserDto,
  ChatUserDirectoryResponseDto,
} from './dtos/chat-user.dto';
import { ApiResponseDto } from '@/shared/dtos/api-response.dto';
import { MessageStatus } from '../../../prisma/generated/client';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  // Create or get conversation
  async createConversation(
    creatorId: string,
    dto: CreateConversationDto,
  ): Promise<ApiResponseDto<ConversationResponseDto>> {
    if (creatorId === dto.participantId) {
      throw new BadRequestException(
        'Cannot create a conversation with yourself',
      );
    }

    const participant = await this.prisma.user.findUnique({
      where: { id: dto.participantId },
    });
    if (!participant) {
      throw new NotFoundException(
        `Participant user ${dto.participantId} not found`,
      );
    }

    let conversation = await this.prisma.conversation.findFirst({
      where: {
        OR: [
          { creatorId, participantId: dto.participantId },
          { creatorId: dto.participantId, participantId: creatorId },
        ],
        deletedAt: null,
      },
      include: {
        creator: true,
        participant: true,
      },
    });

    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: {
          creatorId,
          participantId: dto.participantId,
        },
        include: {
          creator: true,
          participant: true,
        },
      });
    }

    const formatted: ConversationResponseDto = {
      id: conversation.id,
      creator: conversation.creator
        ? {
            id: conversation.creator.id,
            name: conversation.creator.name,
            image: conversation.creator.image,
          }
        : null,
      participant: conversation.participant
        ? {
            id: conversation.participant.id,
            name: conversation.participant.name,
            image: conversation.participant.image,
          }
        : null,
      createdAt: conversation.createdAt,
    };

    return ApiResponseDto.ok(
      formatted,
      'Conversation created/retrieved successfully',
    );
  }

  // Get user's conversation list
  async getUserConversations(
    userId: string,
  ): Promise<ApiResponseDto<ConversationResponseDto[]>> {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        OR: [{ creatorId: userId }, { participantId: userId }],
        deletedAt: null,
      },
      include: {
        creator: true,
        participant: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    const formatted: ConversationResponseDto[] = conversations.map((c) => ({
      id: c.id,
      creator: c.creator
        ? { id: c.creator.id, name: c.creator.name, image: c.creator.image }
        : null,
      participant: c.participant
        ? {
            id: c.participant.id,
            name: c.participant.name,
            image: c.participant.image,
          }
        : null,
      createdAt: c.createdAt,
    }));

    return ApiResponseDto.ok(formatted, 'Conversations fetched successfully');
  }

  // Send message
  async sendMessage(
    senderId: string,
    dto: SendChatMessageDto,
  ): Promise<ApiResponseDto<ChatMessageResponseDto>> {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: dto.conversationId, deletedAt: null },
    });
    if (!conversation) {
      throw new NotFoundException(
        `Conversation with ID ${dto.conversationId} not found`,
      );
    }

    const receiverId =
      conversation.creatorId === senderId
        ? conversation.participantId
        : conversation.creatorId;

    const message = await this.prisma.message.create({
      data: {
        conversationId: dto.conversationId,
        senderId,
        receiverId,
        message: dto.message,
        attachmentId: dto.attachmentId,
        status: MessageStatus.SENT,
      },
      include: {
        attachment: true,
      },
    });

    // Update conversation timestamp
    await this.prisma.conversation.update({
      where: { id: dto.conversationId },
      data: { updatedAt: new Date() },
    });

    const formatted: ChatMessageResponseDto = {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      receiverId: message.receiverId,
      message: message.message,
      status: message.status,
      attachment: message.attachment
        ? {
            id: message.attachment.id,
            name: message.attachment.name,
            type: message.attachment.type,
            size: message.attachment.size,
            file: message.attachment.file,
          }
        : null,
      createdAt: message.createdAt,
    };

    return ApiResponseDto.ok(formatted, 'Message sent successfully');
  }

  // Get messages in a conversation
  async getMessages(
    userId: string,
    conversationId: string,
  ): Promise<ApiResponseDto<ChatMessageResponseDto[]>> {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: conversationId, deletedAt: null },
    });
    if (!conversation) {
      throw new NotFoundException(
        `Conversation with ID ${conversationId} not found`,
      );
    }

    if (
      conversation.creatorId !== userId &&
      conversation.participantId !== userId
    ) {
      throw new BadRequestException('Unauthorized to view this conversation');
    }

    const messages = await this.prisma.message.findMany({
      where: { conversationId, deletedAt: null },
      include: { attachment: true },
      orderBy: { createdAt: 'asc' },
    });

    const formatted: ChatMessageResponseDto[] = messages.map((m) => ({
      id: m.id,
      conversationId: m.conversationId,
      senderId: m.senderId,
      receiverId: m.receiverId,
      message: m.message,
      status: m.status,
      attachment: m.attachment
        ? {
            id: m.attachment.id,
            name: m.attachment.name,
            type: m.attachment.type,
            size: m.attachment.size,
            file: m.attachment.file,
          }
        : null,
      createdAt: m.createdAt,
    }));

    return ApiResponseDto.ok(formatted, 'Messages fetched successfully');
  }

  // Search users for starting chat
  async searchUsers(
    currentUserId: string,
    query: QueryChatUserDto,
  ): Promise<ApiResponseDto<ChatUserDirectoryResponseDto[]>> {
    const where = {
      id: { not: currentUserId },
      ...(query.q
        ? {
            OR: [
              { name: { contains: query.q, mode: 'insensitive' as const } },
              { email: { contains: query.q, mode: 'insensitive' as const } },
            ],
          }
        : {}),
      deletedAt: null,
    };

    const users = await this.prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
      take: 20,
    });

    return ApiResponseDto.ok(users, 'Chat user directory fetched successfully');
  }
}
