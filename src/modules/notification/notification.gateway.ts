import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ReportTaskService } from '../report-task/report-task.service';
import { AuthService } from '../auth/auth.service';
import { Notification } from './schema/notification.schema';

@WebSocketGateway({
  namespace: 'notification',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['token'],
    credentials: true,
  },
})
export class NotificationGateway implements OnModuleInit {
  constructor(private readonly authService: AuthService) {}
  @WebSocketServer()
  server: Server;

  AllUser = new Map();

  onModuleInit() {
    this.server.use(async (socket: any, next) => {
      const token = socket.handshake.headers.token;
      if (!token) {
        return next(new Error('Authentication Error'));
      }
      const user = await this.authService.verifyToken(token as string);
      if (!user) {
        return next(new Error('Authentication Error'));
      }
      socket.userId = user;
      this.AllUser.set(socket.userId, socket.id);
      next();
    });
    this.server.on('connection', (socket: any) => {
      socket.join(socket.userId as string);
      console.log('Connected');
    });
    this.server.on('disconnect', (socket) => {
      console.log('Disconnected');
    });
  }

  @WebSocketServer()
  @SubscribeMessage('notify')
  notifyEvent(@MessageBody() notification: Notification) {
    // if (this.AllUser.has(notification.to)) {
    //   console.log(this.AllUser.get(notification.to));
    // }
    console.log('received notification');
    this.server
      .to(notification.to.toString() as string)
      .emit('notification', notification);
  }
}
