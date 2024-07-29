import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { RoomChat } from 'src/modules/room_chat/schema/room_chat.schema';
import { Task } from 'src/modules/task/schema/task.schema';
import { User } from 'src/modules/user/schema/user.schema';

@Schema({
  timestamps: true,
})
export class Message {
  @Prop({ require: true, type: mongoose.Schema.Types.ObjectId, ref: User.name })
  userId: string | mongoose.Schema.Types.ObjectId;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: RoomChat.name,
  })
  roomChatId: string | mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.String, ref: Task.name })
  taskId: string | mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  payload: string;

  @Prop({ required: true })
  orderIndex: number;

  @Prop({ required: true, default: true })
  status: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
