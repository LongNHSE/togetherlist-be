import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { mongo, ObjectId, Types } from 'mongoose';
import { User } from 'src/modules/user/schema/user.schema';
import { WorkSpace } from 'src/modules/workspace/schema/workspace.schema';

@Schema({ timestamps: true })
export class RoomChat {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: WorkSpace.name,
  })
  workspaceId: string | mongoose.Schema.Types.ObjectId | Types.ObjectId;

  @Prop({ required: false, default: true })
  status: boolean;

  @Prop({ required: true })
  name: string;

  _id: string;

  //   @Prop({
  //     required: false,
  //     type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }],
  //   })
  //   members: string[] | mongoose.Schema.Types.ObjectId[];
}

export const RoomChatSchema = SchemaFactory.createForClass(RoomChat);
