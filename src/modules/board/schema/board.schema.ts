import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Section } from 'src/modules/section/schema/section.schema';
import { WorkSpace } from 'src/modules/workspace/schema/workspace.schema';
import { Status } from './status.schema';

@Schema({
  timestamps: true,
})
export class Board extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkSpace',
  })
  workspace: WorkSpace | string;

  @Prop({
    required: false,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section' }],
    ref: 'Section',
  })
  sections: Section[];

  @Prop({
    required: false,
    type: [Status],
  })
  taskStatus: Status[];

  @Prop({ required: false, default: 0 })
  totalTask: number;

  _id: string | mongoose.Types.ObjectId;
}

const boardSchema = SchemaFactory.createForClass(Board);

// Pre-save hook to generate taskStatus with unique _id values
boardSchema.pre('save', function (next) {
  if (true) {
    this.taskStatus = [
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
        color: '#c9c35a',
        index: 3,
        _id: new mongoose.Types.ObjectId(),
      },
      {
        name: 'Done',
        color: '#84ea69',
        index: 4,
        _id: new mongoose.Types.ObjectId(),
      },
    ];
  } else {
    this.taskStatus = this.taskStatus.map((status) => ({
      ...status,
      _id: status._id || new mongoose.Types.ObjectId(),
    }));
  }
  next();
});

export { boardSchema };
