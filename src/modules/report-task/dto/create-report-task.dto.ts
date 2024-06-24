import { IsOptional } from 'class-validator';
import mongoose from 'mongoose';

export class CreateReportTaskDto {
  task: string;
  board: string;
  oldStatus: string | mongoose.Schema.Types.ObjectId;
  newStatus: string | mongoose.Schema.Types.ObjectId;
  assignee: string | mongoose.Schema.Types.ObjectId;
  //   @IsOptional()
  //   isNewAssignee: boolean;
  //   @IsOptional()
  //   isNewStatus: boolean;
}
