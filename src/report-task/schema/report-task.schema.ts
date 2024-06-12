import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Board } from 'src/modules/board/schema/board.schema';
import { Task } from 'src/modules/task/schema/task.schema';
import { User } from 'src/modules/user/schema/user.schema';
import { WorkSpace } from 'src/modules/workspace/schema/workspace.schema';

@Schema({
  timestamps: true,
})
export class ReportTask {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Task.name,
  })
  task: string | Task;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Board.name,
  })
  board: Board | string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board.taskStatus',
    required: true,
  })
  oldStatus: string | mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board.taskStatus',
    required: true,
  })
  newStatus: string | mongoose.Schema.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  description: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  assignee: User | string;

  //   @Prop({
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'User',
  //     required: true,
  //   })
  //   reporter: User | string;

  @Prop({ required: true, type: Boolean })
  isNewAssignee: boolean;

  @Prop({ required: true, type: Boolean })
  isNewStatus: boolean;

  @Prop({ required: true, type: Boolean })
  isNewSchedule: boolean;
}

export const reportTaskSchema = SchemaFactory.createForClass(ReportTask);
