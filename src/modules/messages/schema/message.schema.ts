import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Room } from 'src/modules/room/schema/room.schema';
import { User } from 'src/modules/user/schema/user.schema';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true })
  content: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Room' })
  room: Room;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
