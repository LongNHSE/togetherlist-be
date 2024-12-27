import { ChatService } from './chat.service';
import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';
import { ChatController } from './chat.controller';

@Module({
  controllers: [ChatController],
  imports: [AuthModule],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
