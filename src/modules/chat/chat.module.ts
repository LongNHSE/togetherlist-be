import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [ChatGateway],
})
export class ChatModule {}
