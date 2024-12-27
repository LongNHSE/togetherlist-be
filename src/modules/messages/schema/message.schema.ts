import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Room } from 'src/modules/room/schema/room.schema';
import { RoomChat } from 'src/modules/room_chat/schema/room_chat.schema';
import { Task } from 'src/modules/task/schema/task.schema';
import { User } from 'src/modules/user/schema/user.schema';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: RoomChat.name,
  })
  roomChat: RoomChat;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  sender: User;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: Task.name,
  })
  task?: Task;

  @Prop({ required: true })
  content: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
