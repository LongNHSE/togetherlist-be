import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { taskSchema } from './schema/task.schema';
import { BoardService } from '../board/board.service';
import { Board, boardSchema } from '../board/schema/board.schema';
import { SectionService } from '../section/section.service';
import { Section, sectionSchema } from '../section/schema/section.schema';
import { BullModule } from '@nestjs/bullmq';
import { TaskProcessor } from './task.processor';
import {
  ReportTask,
  reportTaskSchema,
} from 'src/modules/report-task/schema/report-task.schema';

@Module({
  controllers: [TaskController],
  imports: [
    MongooseModule.forFeature([{ name: 'Task', schema: taskSchema }]),
    BullModule.registerQueue({
      name: 'task-queue',

      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    MongooseModule.forFeature([{ name: Board.name, schema: boardSchema }]),
    MongooseModule.forFeature([{ name: Section.name, schema: sectionSchema }]),
    MongooseModule.forFeature([
      { name: ReportTask.name, schema: reportTaskSchema },
    ]),
  ],
  providers: [TaskService, BoardService, SectionService, TaskProcessor],
})
export class TaskModule {}
