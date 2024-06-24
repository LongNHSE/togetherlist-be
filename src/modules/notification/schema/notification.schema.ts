import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Task } from 'src/modules/task/schema/task.schema';
import { User } from 'src/modules/user/schema/user.schema';
import { WorkSpace } from 'src/modules/workspace/schema/workspace.schema';

@Schema({
  timestamps: true,
})
export class Notification {
  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: WorkSpace.name,
  })
  workspace: WorkSpace | string;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: Task.name,
  })
  task: Task | string;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  to: User | string;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  assignee: User | string | null | undefined;

  @Prop({ required: false, type: String })
  oldStatus: string | null;

  @Prop({ required: false, type: String })
  newStatus: string | null;

  @Prop({ required: true, default: 'unread' })
  status: string;

  @Prop({ required: false })
  isNewStatus: boolean;

  @Prop({ required: false })
  isNewAssignee: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
