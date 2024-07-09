import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  timestamps: true,
})
export class SubscriptionType {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  duration: number;

  _id: string | mongoose.Schema.Types.ObjectId;
}

export const SubscriptionTypeSchema =
  SchemaFactory.createForClass(SubscriptionType);
