import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Board } from 'src/modules/board/schema/board.schema';
import { User } from 'src/modules/user/schema/user.schema';

export type TaskDocumen = Task & mongoose.Document;

@Schema({
  timestamps: true,
})
export class Task {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Board' })
  board: Board | string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
    required: true,
  })
  section: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  assignee: User | string;

  @Prop({ required: true })
  name: string;

  @Prop(
    raw({
      from: Date,
      to: Date,
      timezone: String,
    }),
  )
  schedule: { from: Date; to: Date; timezone: string };

  // @Prop({ required: true })
  // status: string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board.taskStatus',
    required: true,
  })
  status: mongoose.Schema.Types.ObjectId | string;

  @Prop({ required: true })
  index: number;

  @Prop({ required: false, type: String })
  description: string;

  @Prop({ required: true, type: Boolean, default: false })
  isPriority: boolean;

  _id: string;
}

export const taskSchema = SchemaFactory.createForClass(Task);
