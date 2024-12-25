import { Module } from '@nestjs/common';
import { RoomChatMemberService } from './room_chat_member.service';
import { RoomChatMemberController } from './room_chat_member.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RoomChatMember,
  RoomChatMemberSchema,
} from './schema/room_chat_member.schema';

@Module({
  controllers: [RoomChatMemberController],
  imports: [
    MongooseModule.forFeature([
      {
        name: RoomChatMember.name,
        schema: RoomChatMemberSchema,
      },
    ]),
  ],
  providers: [RoomChatMemberService],
})
export class RoomChatMemberModule {}
