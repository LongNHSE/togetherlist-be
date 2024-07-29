import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Room } from 'src/modules/room/schema/room.schema';
import { SubscriptionPlan } from 'src/modules/subscription-plan/schema/subscription-plan.shema';

export type UserDocument = User & Document;

@Schema({
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

  subscriptionPlan: SubscriptionPlan | null | string;
}

export const userSchema = SchemaFactory.createForClass(User);
