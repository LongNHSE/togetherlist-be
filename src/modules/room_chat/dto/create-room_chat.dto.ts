import { IsNotEmpty, IsString } from 'class-validator';
import mongoose, { Types } from 'mongoose';
import { IsWorkspaceExist } from 'src/modules/workspace/validator/is-workspace-existed.validator';

export class CreateRoomChatDto {
  @IsNotEmpty()
  @IsString()
  @IsWorkspaceExist()
  workspaceId: string | mongoose.Schema.Types.ObjectId | Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  name: string;
}
