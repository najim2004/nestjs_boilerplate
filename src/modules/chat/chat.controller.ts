import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { IUserContext } from '@/shared/interfaces/user-context.interface';
import { ChatService } from './chat.service';
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

@ApiTags('chat')
@ApiBearerAuth()
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('conversations')
  @ApiOperation({ summary: 'Create or get existing conversation with a user' })
  @ApiResponse({ status: 201, type: ConversationResponseDto })
  async createConversation(
    @CurrentUser() user: IUserContext,
    @Body() dto: CreateConversationDto,
  ): Promise<ApiResponseDto<ConversationResponseDto>> {
    return this.chatService.createConversation(user.userId, dto);
  }

  @Get('conversations')
  @ApiOperation({ summary: 'List user conversations' })
  @ApiResponse({ status: 200, type: [ConversationResponseDto] })
  async getUserConversations(
    @CurrentUser() user: IUserContext,
  ): Promise<ApiResponseDto<ConversationResponseDto[]>> {
    return this.chatService.getUserConversations(user.userId);
  }

  @Post('messages')
  @ApiOperation({ summary: 'Send message in a conversation' })
  @ApiResponse({ status: 201, type: ChatMessageResponseDto })
  async sendMessage(
    @CurrentUser() user: IUserContext,
    @Body() dto: SendChatMessageDto,
  ): Promise<ApiResponseDto<ChatMessageResponseDto>> {
    return this.chatService.sendMessage(user.userId, dto);
  }

  @Get('conversations/:id/messages')
  @ApiOperation({ summary: 'Get all messages in a conversation' })
  @ApiResponse({ status: 200, type: [ChatMessageResponseDto] })
  async getMessages(
    @CurrentUser() user: IUserContext,
    @Param('id') conversationId: string,
  ): Promise<ApiResponseDto<ChatMessageResponseDto[]>> {
    return this.chatService.getMessages(user.userId, conversationId);
  }

  @Get('users')
  @ApiOperation({ summary: 'Search users to initiate chat' })
  @ApiResponse({ status: 200, type: [ChatUserDirectoryResponseDto] })
  async searchUsers(
    @CurrentUser() user: IUserContext,
    @Query() query: QueryChatUserDto,
  ): Promise<ApiResponseDto<ChatUserDirectoryResponseDto[]>> {
    return this.chatService.searchUsers(user.userId, query);
  }
}
