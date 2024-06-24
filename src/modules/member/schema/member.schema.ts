import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type MemberDocument = Member & Document;

@Schema({
  timestamps: true,
})
export class Member {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    sparse: true,
  })
  memberId: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
  })
  workspaceId: string | any;
  @Prop({ required: true, default: 'member' })
  role: string;

  @Prop({ required: true, default: 'invited' })
  status: string;

  _id: string;
}

const MemberSchema = SchemaFactory.createForClass(Member);
MemberSchema.index({ memberId: 1, workspaceId: 1 }, { unique: true });

export { MemberSchema };
