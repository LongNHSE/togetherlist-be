import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class CreateBoardStatusDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  color: string;

  @IsOptional()
  @IsString()
  index: number;

  _id: mongoose.Types.ObjectId;
}
