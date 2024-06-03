import { Prop } from '@nestjs/mongoose';

export class Status {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  color: string;

  @Prop({ required: true, default: 0 })
  index: number;
}
