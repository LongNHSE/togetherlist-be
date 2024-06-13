import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Room } from 'src/modules/room/schema/room.schema';
import { User } from 'src/modules/user/schema/user.schema';
export type ChatDocument = HydratedDocument<Chat>;
export class Chat {
  @Prop({ required: true })
  content: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    autopopulate: true,
  })
  sender_id: User;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Room.name,
  })
  room_id: Room;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
