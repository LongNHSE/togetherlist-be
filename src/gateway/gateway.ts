import { Server } from 'socket.io';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { OnModuleInit } from '@nestjs/common';

@WebSocketGateway({})
export class ChatGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('Connected');
    });
  }

  @WebSocketServer()
  @SubscribeMessage('newMessage')
  handleMessage(@MessageBody() message: any): void {
    console.log(message);
    this.server.emit('onMessage', {
      msg: 'New Messages',
      content: message,
    });
  }
}
