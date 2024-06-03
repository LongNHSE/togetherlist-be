import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Section } from 'src/modules/section/schema/section.schema';
import { WorkSpace } from 'src/modules/workspace/schema/workspace.schema';
import { Status } from './status.schema';

@Schema({
  timestamps: true,
})
export class Board {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkSpace',
  })
  workspace: WorkSpace;

  @Prop({
    required: false,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section' }],
    ref: 'Section',
  })
  sections: Section[];

  // @Prop({
  //   required: false,
  //   type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  //   ref: 'Task',
  // })
  // tasks: Task[];

  @Prop({
    required: false,
    type: [Status],
    default: [
      {
        name: 'Unassigned',
        color: '#b3b3a3',
        index: 1,
        _id: new mongoose.Types.ObjectId(),
      },
      {
        name: 'To Do',
        color: '#FFA500',
        index: 2,
        _id: new mongoose.Types.ObjectId(),
      },
      {
        name: 'In Progress',
        color: '#FFFF00',
        index: 3,
        _id: new mongoose.Types.ObjectId(),
      },
      {
        name: 'Done',
        color: '#84ea69',
        index: 4,
        _id: new mongoose.Types.ObjectId(),
      },
    ],
  })
  taskStatus: [Status];

  @Prop({ required: false, default: 0 })
  totalTask: number;
}

export const boardSchema = SchemaFactory.createForClass(Board);
// export { boardSchema };
