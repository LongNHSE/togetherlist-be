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
    ref: 'User'
  })
  userId: string;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'SubscriptionPlan'
  })
  subscriptionPlanId: string;

  @Prop({ required: true })
  invoiceDate: Date;

  @Prop({ required: true })
  dueDate: Date;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({
    required: true,
    enum: ['Sent', 'Paid', 'Partially Paid', 'Overdue', 'Cancelled']
  })
  status: string;

  @Prop({ required: true })
  paymentMethod: string;

  @Prop({ required: true })
  billingAddress: string;

  @Prop()
  discountAmmount: number;

  @Prop()
  notes: string;

  @Prop()
  createdBy: string;

  @Prop()
  updatedBy: string;
}

export const invoiceSchema = SchemaFactory.createForClass(Invoice);
