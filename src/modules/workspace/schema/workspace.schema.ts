import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Board } from 'src/modules/board/schema/board.schema';
import { Member, MemberSchema } from 'src/modules/member/schema/member.schema';
import { User } from 'src/modules/user/schema/user.schema';

export type WorkSpaceDocument = WorkSpace & Document;
@Schema({
  timestamps: true,
})
export class WorkSpace {
  @Prop({ ref: 'User', required: true, type: mongoose.Schema.Types.ObjectId })
  owner: User;

  @Prop({
    required: false,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Board' }],
  })
  boards: Board[];

  // @Prop({
  //   required: false,
  //   type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  // })
  // members: User[];

  @Prop({
    required: false,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
  })
  members: Member[];

  @Prop(
    raw({
      visibility: String,
      boardCreationRestrictions: Boolean,
      sharingBoardRestrictions: Boolean,
    }),
  )
  config: {
    visibility: string;
    boardCreationRestrictions: boolean;
    sharingBoardRestrictions: boolean;
  };

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  banner: string;

  @Prop({ required: false })
  description: string;

  @Prop({ default: 'active' })
  status: string;
}

export const workspaceSchema = SchemaFactory.createForClass(WorkSpace);
