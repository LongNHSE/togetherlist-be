import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  ValidateIf,
} from 'class-validator';
import { RoomType } from '../enums/room-type-enum';

export class CreateRoomDto {
  @IsNotEmpty()
  @ValidateIf((o) => o.type != RoomType.PERSONAL)
  name: string;

  @IsArray()
  @ArrayNotEmpty()
  members: string[];

  @IsEnum(RoomType)
  @ValidateIf((o) => o.type)
  type: RoomType;
}
