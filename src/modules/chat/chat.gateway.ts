import { Server } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Body, OnModuleInit } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway implements OnModuleInit {
  constructor(private authService: AuthService) {}

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    // this.server.use(async (socket: any, next) => {
    //   const token = socket.handshake.headers.token;
    //   if (!token) {
    //     return next(new Error('Authentication Error'));
    //   }
    //   const user = await this.authService.verifyToken(token as string);
    //   if (!user) {
    //     return next(new Error('Authentication Error'));
    //   }
    //   socket.userId = user;
    //   next();
    // });

    this.server.on('connection', (socket: Socket) => {
      this.emitConnectedUsers();

      socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`);
        this.emitConnectedUsers();
      });
    });
  }

  emitConnectedUsers() {
    const users = [];
    for (const [id, socket] of this.server.sockets as any) {
      users.push({
        socketId: id,
        userId: socket.userId,
      });
    }
    // Emit the connected users to all clients
    this.server.emit('users', users);
    console.log(users);
  }

  @SubscribeMessage('newMessage')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: any,
  ): void {
    this.server.emit('onMessage', {
      msg: 'New Messages',
      content: message,
    });
  }

  @SubscribeMessage('join')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody('room') room: string,
  ): void {
    client.join(room);
    client.emit('joined', room);
  }

  @SubscribeMessage('roomMessage')
  handleRoomMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody('message') message: any,
    @MessageBody('room') room: string,
  ): void {
    this.server.to(room).emit('onRoomMessage', {
      msg: 'New Room Message',
      content: message,
    });
  }
}
