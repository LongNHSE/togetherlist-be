// src/task/task.processor.ts
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { TaskService } from './task.service';

@Processor('task-queue')
export class TaskProcessor extends WorkerHost {
  constructor(private readonly taskService: TaskService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { taskId, assignedTo } = job.data;
    this.taskService.sendNotification(taskId, assignedTo);
  }
}
