import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Board } from './schema/board.schema';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class BoardService {
  constructor(@InjectModel(Board.name) private boardModel: Model<Board>) {}

  async findBoardsByWorkspaceId(workspaceId: string) {
    return await this.boardModel.aggregate([
      {
        $match: {
          workspace: new mongoose.Types.ObjectId(workspaceId),
        },
      },
      {
        $lookup: {
          from: 'sections',
          localField: 'sections',
          foreignField: '_id',
          as: 'sections',
          pipeline: [
            {
              $lookup: {
                from: 'tasks',
                localField: '_id',
                foreignField: 'section',
                as: 'tasks',
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$sections',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$sections.tasks',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: {
            boardId: '$_id',
            boardName: '$name',
            taskStatus: '$taskStatus',
            status: '$sections.tasks.status',
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: {
            boardId: '$_id.boardId',
            boardName: '$_id.boardName',
            taskStatus: '$_id.taskStatus',
          },
          total: { $sum: '$count' },
          statuses: { $push: { status: '$_id.status', count: '$count' } },
        },
      },
      {
        $project: {
          _id: '$_id.boardId',
          name: '$_id.boardName',
          totalTask: '$total',
          taskStatus: '$_id.taskStatus',
          statuses: {
            $map: {
              input: '$statuses',
              as: 'status',
              in: {
                label: '$$status.status',
                value: {
                  $multiply: [{ $divide: ['$$status.count', '$total'] }, 100],
                },
              },
            },
          },
        },
      },
    ]);
  }

  updateIndex(board: string) {
    return this.boardModel.findByIdAndUpdate(
      board,
      {
        $inc: { totalTask: 1 },
      },
      { new: true },
    );
  }

  async getTotalTask(board: string) {
    const doc = await this.boardModel.findById(board, 'totalTask -_id');
    return doc ? doc.totalTask : 0;
  }

  create(createBoardDto: CreateBoardDto) {
    return this.boardModel.create(createBoardDto);
  }

  findAll() {
    return `This action returns all board`;
  }

  findOne(id: number) {
    return `This action returns a #${id} board`;
  }

  update(id: number, updateBoardDto: UpdateBoardDto) {
    return `This action updates a #${id} board`;
  }

  remove(id: number) {
    return `This action removes a #${id} board`;
  }
}
