import { Module } from '@nestjs/common';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Section, sectionSchema } from './schema/section.schema';
import { Board, boardSchema } from '../board/schema/board.schema';
import { Task, taskSchema } from '../task/schema/task.schema';

@Module({
  controllers: [SectionController],
  imports: [
    MongooseModule.forFeature([{ name: Section.name, schema: sectionSchema }]),
    MongooseModule.forFeature([{ name: Board.name, schema: boardSchema }]),
    MongooseModule.forFeature([{ name: Task.name, schema: taskSchema }]),
  ],
  providers: [SectionService],
  exports: [SectionService],
})
export class SectionModule {}
