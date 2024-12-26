/*
https://docs.nestjs.com/websockets/gateways#gateways
*/

import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Message } from '../messages/schema/message.schema';

@WebSocketGateway({
  namespace: '/room_chat',
})
export class Room_chatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string) {
    this.server.emit('events', data);
  }

  handleConnection(client: any, ...args: any[]) {
    console.log('User connected');
  }

  handleDisconnect(client: any) {
    console.log('User disconnected');
  }

  afterInit(server: any) {
    console.log('Socket is live');
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`Client ${client.id} joining room: ${room}`);
    client.join(room);
    this.server.to(room).emit('message', {
      user: 'System',
      text: `User ${client.id} has joined the room. ${room}`,
    });
    console.log(`Client ${client.id} joined room: ${room}`);
  }

  // Handle sending messages
  @SubscribeMessage('sendMessage')
  handleSendMessage(@MessageBody() data: Message) {
    console.log(data);
    console.log(data.roomChat._id);
    this.server.to(data.roomChat._id.toString()).emit('sendMessage', data);
    console.log(`Message sent to room ${data.roomChat._id}: ${data.content}`);
  }
}
