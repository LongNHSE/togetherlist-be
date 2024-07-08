import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Room } from 'src/modules/room/schema/room.schema';

export type UserDocument = User & Document;

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
  timestamps: true,
})
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ enum: ['admin', 'user', 'staff'], default: 'user' })
  role: string;

  @Prop({ default: 'active', enum: ['active', 'inactive'] })
  status: string;

  @Prop()
  avatar: string;

  @Prop({ unique: true, sparse: true })
  phone: string;

  @Prop()
  gender: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }] })
  rooms: Room[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }] })
  joinedRooms: Room[];

  @Prop({ required: false })
  bio: string;

  @Prop()
  refreshToken: string;

  _id: string;
}

export const userSchema = SchemaFactory.createForClass(User);
