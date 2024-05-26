import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { taskSchema } from './schema/task.schema';
import { BoardService } from '../board/board.service';
import { Board, boardSchema } from '../board/schema/board.schema';
import { SectionService } from '../section/section.service';
import { Section, sectionSchema } from '../section/schema/section.schema';

@Module({
  controllers: [TaskController],
  imports: [
    MongooseModule.forFeature([{ name: 'Task', schema: taskSchema }]),
    MongooseModule.forFeature([{ name: Board.name, schema: boardSchema }]),
    MongooseModule.forFeature([{ name: Section.name, schema: sectionSchema }]),
  ],
  providers: [TaskService, BoardService, SectionService],
})
export class TaskModule {}
