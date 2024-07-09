import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InvoiceDocument = Invoice & Document;

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
  timestamps: true,
})
export class Invoice {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'User',
  })
  userId: string;

  @Prop({
    required: true,
    type: Number,
  })
  orderCode: number;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'SubscriptionPlan',
  })
  subscriptionPlanId: string;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({
    required: true,
    enum: ['Sent', 'Paid', 'Partially Paid', 'Overdue', 'Cancelled'],
    default: 'Sent',
  })
  status: string;

  @Prop({ required: true })
  paymentMethod: string;

  @Prop()
  discountAmmount: number;
}

export const invoiceSchema = SchemaFactory.createForClass(Invoice);
