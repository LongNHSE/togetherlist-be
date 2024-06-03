import { Prop } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export class Status {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    index: true,
    required: true,
    auto: true,
  })
  _id: mongoose.Schema.Types.ObjectId;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  color: string;

  @Prop({ required: true, default: 0 })
  index: number;
}
