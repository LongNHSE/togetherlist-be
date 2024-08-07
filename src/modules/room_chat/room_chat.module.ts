import { Module } from '@nestjs/common';
import { RoomChatService } from './room_chat.service';
import { RoomChatController } from './room_chat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomChat, RoomChatSchema } from './schema/room_chat.schema';

@Module({
  controllers: [RoomChatController],
  imports: [
    MongooseModule.forFeature([
      {
        name: RoomChat.name,
        schema: RoomChatSchema,
      },
    ]),
  ],
  providers: [RoomChatService],
  exports: [RoomChatService],
})
export class RoomChatModule {}
