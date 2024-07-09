import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
  timestamps: true,
})
export class Transaction {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Invoice',
  })
  invoiceId: string;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'User',
  })
  userId: string;

  // @Prop({ required: true })
  // transactionDate: Date;

  @Prop({ required: true })
  amount: number;

  // @Prop({ required: true })
  // transactionType: string;

  @Prop({ required: true })
  paymentMethod: string;

  @Prop({ required: true })
  status: string;

  // @Prop()
  // notes: string;

  // @Prop()
  // createdBy: string;
}

export const transactionSchema = SchemaFactory.createForClass(Transaction);
