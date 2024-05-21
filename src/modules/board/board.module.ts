import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { Board, boardSchema } from './schema/board.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [BoardController],
  imports: [
    MongooseModule.forFeature([{ name: Board.name, schema: boardSchema }]),
  ],
  providers: [BoardService],
})
export class BoardModule {}
