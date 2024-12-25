import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { SubscriptionType } from 'src/modules/subscription_type/schema/subscription_type.schema';
import { User } from 'src/modules/user/schema/user.schema';

export type SubscriptionPlanDocument = SubscriptionPlan & Document;

@Schema({
  timestamps: true,
})
export class SubscriptionPlan {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  userId: string | mongoose.Schema.Types.ObjectId;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: SubscriptionType.name,
  })
  subscriptionTypeId: string | Types.ObjectId;

  @Prop({ required: true })
  from: Date;

  @Prop({ required: false })
  to: Date;

  @Prop({ required: false, default: 'active' })
  status: string;
}

export const SubscriptionPlanSchema =
  SchemaFactory.createForClass(SubscriptionPlan);
