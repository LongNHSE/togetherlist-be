import { Prop } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export class Status {
  @Prop({
    type: new mongoose.Types.ObjectId(),
    index: true,
    required: true,
    auto: true,
  })
  _id: mongoose.Types.ObjectId;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  color: string;

  @Prop({ required: true, default: 0 })
  index: number;
}
