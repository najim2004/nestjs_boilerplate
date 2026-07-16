import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.WS_CORS_ORIGIN || '*',
    credentials: true,
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(EventsGateway.name);

  @WebSocketServer()
  server!: Server;

  afterInit(): void {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.id}`);
    // Extract user from handshake query or headers if auth is needed
    // client.join(`user_${userId}`);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('ping')
  handlePing(
    @MessageBody() data: unknown,
    @ConnectedSocket() client: Socket,
  ): void {
    this.logger.debug(`Received ping from ${client.id}:`, data);
    client.emit('pong', { timestamp: new Date().toISOString() });
  }

  // Helper method to emit events to specific users
  emitToUser(userId: string, event: string, data: unknown): void {
    this.server.to(`user_${userId}`).emit(event, data);
  }
}
