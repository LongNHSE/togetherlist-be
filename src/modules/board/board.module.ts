import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { Board, boardSchema } from './schema/board.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { IsBoardExistConstaint } from './validator/is-board-exist.validator';
import { SectionModule } from '../section/section.module';
import { WorkspaceService } from '../workspace/workspace.service';
import {
  WorkSpace,
  workspaceSchema,
} from '../workspace/schema/workspace.schema';

@Module({
  controllers: [BoardController],
  imports: [
    SectionModule,
    MongooseModule.forFeature([{ name: Board.name, schema: boardSchema }]),
    MongooseModule.forFeature([
      { name: WorkSpace.name, schema: workspaceSchema },
    ]),
  ],
  providers: [BoardService, IsBoardExistConstaint, WorkspaceService],
  exports: [BoardService],
})
export class BoardModule {}
