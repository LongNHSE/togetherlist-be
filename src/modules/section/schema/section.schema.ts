import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Board } from 'src/modules/board/schema/board.schema';
import { Task } from 'src/modules/task/schema/task.schema';

@Schema({
  timestamps: true,
})
export class Section {
  @Prop({ required: true })
  name: string;

  @Prop({ ref: 'Board', required: true, type: mongoose.Schema.Types.ObjectId })
  board: Board;

  @Prop({
    required: false,
    ref: 'Task',
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  })
  tasks: Task[];
}

export const sectionSchema = SchemaFactory.createForClass(Section);
