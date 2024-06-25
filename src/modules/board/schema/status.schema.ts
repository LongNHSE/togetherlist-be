import { Prop } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export class Status {
  @Prop({ required: true, default: () => new mongoose.Types.ObjectId() })
  _id: mongoose.Types.ObjectId;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  color: string;

  @Prop({ required: true, default: 0 })
  index: number;
}
