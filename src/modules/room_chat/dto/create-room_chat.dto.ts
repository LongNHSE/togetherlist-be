import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import mongoose, { Types } from 'mongoose';
import { IsWorkspaceExist } from 'src/modules/workspace/validator/is-workspace-existed.validator';
import { RoomChatType } from '../schema/room_chat.schema';
import { Type } from 'class-transformer';
import { MemberChatDto } from './member_chat.dto';

export class CreateRoomChatDto {
  @IsNotEmpty()
  @IsString()
  @IsWorkspaceExist()
  workspaceId: string | mongoose.Schema.Types.ObjectId | Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(RoomChatType)
  type: RoomChatType;

  @IsOptional()
  @IsString()
  creator: string;

  @IsNotEmpty()
  @IsArray()
  @Type(() => MemberChatDto)
  @ValidateNested({ each: true })
  members: MemberChatDto[];
}
