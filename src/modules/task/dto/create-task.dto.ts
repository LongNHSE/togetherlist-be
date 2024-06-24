import { Exclude, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateScheduleDto } from './create-schedule.dto';
import { IsBoardExist } from 'src/modules/board/validator/is-board-exist.validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  @IsBoardExist()
  board: string;

  @IsNotEmpty()
  @IsString()
  section: string;

  @IsOptional()
  @IsString()
  assignee: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateScheduleDto)
  schedule: CreateScheduleDto;

  @IsNotEmpty()
  @IsString()
  status: string;

  @Exclude()
  index: number;

  @IsOptional()
  @IsBoolean()
  isPriority: boolean;
}
