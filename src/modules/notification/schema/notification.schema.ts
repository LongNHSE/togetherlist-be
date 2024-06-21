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

  @Prop({ required: true, default: 'unread' })
  status: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
