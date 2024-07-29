import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { RoomChat } from 'src/modules/room_chat/schema/room_chat.schema';
import { User } from 'src/modules/user/schema/user.schema';

@Schema({ timestamps: true })
export class RoomChatMember {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: RoomChat.name,
  })
  roomChatId: string | mongoose.Schema.Types.ObjectId;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  userId: string | mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, enum: ['owner', 'member'], default: 'member' })
  role: string;
}
export const RoomChatMemberSchema =
  SchemaFactory.createForClass(RoomChatMember);
