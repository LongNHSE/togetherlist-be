import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Section } from 'src/modules/section/schema/section.schema';
import { WorkSpace } from 'src/modules/workspace/schema/workspace.schema';

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

  @Prop({
    required: false,
    type: Array,
    default: ['To Do', 'In Progress', 'Done', 'Unassigned'],
  })
  taskStatus: string[];
}

export const boardSchema = SchemaFactory.createForClass(Board);
