import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Board } from 'src/modules/board/schema/board.schema';
import { Section } from 'src/modules/section/schema/section.schema';
import { User } from 'src/modules/user/schema/user.schema';

export type TaskDocumen = Task & mongoose.Document;

@Schema({
  timestamps: true,
})
export class Task {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Board' })
  board: Board;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
    required: true,
  })
  section: Section;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  assignee: User;

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

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  index: number;

  @Prop({ required: true, type: Boolean, default: false })
  isPriority: boolean;
}

export const taskSchema = SchemaFactory.createForClass(Task);
