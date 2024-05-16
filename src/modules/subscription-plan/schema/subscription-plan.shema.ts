import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';;

export type SubscriptionPlanDocument = SubscriptionPlan & Document;

@Schema()
export class SubscriptionPlan {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'User'
  })
  userId: string;

  @Prop({ required: true })
  planName: string;

  @Prop()
  planDescription: string;

  @Prop({ required: true, type: Number })
  monthlyFee: number;

  @Prop({ type: Number })
  annualFee: number;

  @Prop()
  features: string;
}

export const SubscriptionPlanSchema = SchemaFactory.createForClass(SubscriptionPlan);