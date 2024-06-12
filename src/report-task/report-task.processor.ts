// src/task/task.processor.ts
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ReportTaskService } from './report-task.service';

@Processor('report-task-queue')
export class ReportTaskProcessor extends WorkerHost {
  constructor(private readonly reportTaskService: ReportTaskService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { reportTask } = job.data;
    this.reportTaskService.sendNotification(reportTask);
  }
}

@Processor('assignee-task-queue')
export class AssigneeTaskProcessor extends WorkerHost {
  constructor(private readonly reportTaskService: ReportTaskService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    console.log('AssigneeTaskProcessor');
    const { reportTask } = job.data;
    this.reportTaskService.sendAssigneeNotification(reportTask);
  }
}
