import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { taskSchema } from './schema/task.schema';

@Module({
  controllers: [TaskController],
  imports: [MongooseModule.forFeature([{ name: 'Task', schema: taskSchema }])],
  providers: [TaskService],
})
export class TaskModule {}
