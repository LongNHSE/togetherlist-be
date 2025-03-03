import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/modules/auth/auth.service';

@WebSocketGateway({
  namespace: 'notification',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['token'],
    credentials: true,
  },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly authService: AuthService) {}

  @WebSocketServer()
  server: Server;

  private userSockets: Map<string, string[]> = new Map();

  async handleConnection(client: Socket, ...args: any[]) {
    const jwtToken = client.handshake.headers['token'] as string;
    if (!jwtToken) {
      client.disconnect();
      return;
    }

    try {
      const user = await this.authService.decodeToken(jwtToken);
      console.log(this.userSockets);
      const existingSockets = this.userSockets.get(user.userId) || [];
      this.userSockets.set(user.userId, [...existingSockets, client.id]);
      client.data.user = user; // Store user info on the socket
    } catch (errors) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const user = client.data.user;
    if (user) {
      const existingSockets = this.userSockets.get(user.userId) || [];
      const updatedSockets = existingSockets.filter(
        (socketId) => socketId !== client.id,
      );
      if (updatedSockets.length > 0) {
        this.userSockets.set(user.userId, updatedSockets);
      } else {
        this.userSockets.delete(user.userId);
      }
    }
  }

  // @SubscribeMessage('newNotification')
  // create(@MessageBody() notification: Notification) {
  //   console.log(this.userSockets);
  //   const recipientSocketIds =
  //     this.userSockets.get(notification.) || [];
  //   recipientSocketIds.forEach((socketId) => {
  //     this.server.to(socketId).emit('newNotification', notification);
  //   });
  //   return notification;
  // }
}
