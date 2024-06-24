import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReportTaskService } from './report-task.service';
import { CreateReportTaskDto } from './dto/create-report-task.dto';
import { UpdateReportTaskDto } from './dto/update-report-task.dto';

@Controller('report-task')
export class ReportTaskController {
  constructor(private readonly reportTaskService: ReportTaskService) {}

  @Post()
  create(@Body() createReportTaskDto: CreateReportTaskDto) {
    return this.reportTaskService.create(createReportTaskDto);
  }

  @Get()
  findAll() {
    return this.reportTaskService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportTaskService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReportTaskDto: UpdateReportTaskDto) {
    return this.reportTaskService.update(+id, updateReportTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportTaskService.remove(+id);
  }
}
