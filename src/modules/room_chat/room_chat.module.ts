import { Module } from '@nestjs/common';
import { RoomChatService } from './room_chat.service';
import { RoomChatController } from './room_chat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomChat, RoomChatSchema } from './schema/room_chat.schema';
import { MessagesModule } from '../messages/messages.module';
import { Room_chatGateway } from './room_chat.gateway';

@Module({
  controllers: [RoomChatController],
  imports: [
    MessagesModule,
    MongooseModule.forFeature([
      {
        name: RoomChat.name,
        schema: RoomChatSchema,
      },
    ]),
  ],
  providers: [RoomChatService, Room_chatGateway],
  exports: [RoomChatService],
})
export class RoomChatModule {}
