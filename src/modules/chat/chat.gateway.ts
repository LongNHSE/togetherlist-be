import { Server } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger, OnModuleInit } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';

@WebSocketGateway(800, {
  namespace: '/chats',
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection {
  private readonly logger = new Logger(ChatGateway.name);
  private connectionsCount = 0;
  constructor(private readonly chatService: ChatService) {}
  afterInit(server: any) {
    this.logger.log('WebSocket gateway initialized');
  }

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.connectionsCount++; // Increment connection count
    this.logger.log(`Number of connections: ${this.connectionsCount}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.connectionsCount--; // Decrement connection count
    this.logger.log(`Number of connections: ${this.connectionsCount}`);
  }
  @SubscribeMessage('create')
  async create(
    @ConnectedSocket() client: any,
    @MessageBody() createChatDto: CreateChatDto,
  ) {
    const senderId = client.handshake.user._id.toString();
    const chat = await this.chatService.create(senderId, createChatDto);
    this.server.emit('new-chat', chat);
  }
}
