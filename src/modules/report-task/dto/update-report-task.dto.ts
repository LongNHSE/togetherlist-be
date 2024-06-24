import { PartialType } from '@nestjs/swagger';
import { CreateReportTaskDto } from './create-report-task.dto';

export class UpdateReportTaskDto extends PartialType(CreateReportTaskDto) {}
