import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ObjectId, Types } from 'mongoose';
import { User } from 'src/modules/user/schema/user.schema';

export class CreateRoomDto {
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  readonly title: string;

  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  readonly description: string;

  @IsNotEmpty()
  readonly owner: Types.ObjectId | string;

  @IsOptional()
  readonly participant?: Types.ObjectId;

  @IsOptional()
  @IsArray()
  readonly members?: Types.ObjectId[];

  @IsOptional()
  @IsEnum(['single', 'group'])
  readonly type: string;
}
