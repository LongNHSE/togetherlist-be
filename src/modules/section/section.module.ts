import { Module } from '@nestjs/common';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Section, sectionSchema } from './schema/section.schema';
import { Board, boardSchema } from '../board/schema/board.schema';

@Module({
  controllers: [SectionController],
  imports: [
    MongooseModule.forFeature([{ name: Section.name, schema: sectionSchema }]),
    MongooseModule.forFeature([{ name: Board.name, schema: boardSchema }]),
  ],
  providers: [SectionService],
  exports: [SectionService],
})
export class SectionModule {}
