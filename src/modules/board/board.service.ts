import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Board } from './schema/board.schema';
import mongoose, { Model } from 'mongoose';
import { Section } from '../section/schema/section.schema';
import { Task } from '../task/schema/task.schema';

@Injectable()
export class BoardService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<Board>,
    @InjectModel(Section.name) private sectionModel: Model<Section>,
    @InjectModel(Task.name) private taskModel: Model<any>,
  ) {}

  async findBoardsByWorkspaceId(workspaceId: string) {
    console.log(workspaceId);
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
            $filter: {
              input: '$statuses',
              as: 'status',
              cond: { $in: ['$$status.status', '$_id.taskStatus'] },
            },
          },
        },
      },
      {
        $addFields: {
          statuses: {
            $cond: {
              if: { $eq: [{ $size: '$statuses' }, 0] },
              then: [],
              else: '$statuses',
            },
          },
        },
      },
      {
        $project: {
          _id: '$_id',
          name: '$name',
          totalTask: '$totalTask',
          taskStatus: '$taskStatus',
          statuses: {
            $map: {
              input: '$statuses',
              as: 'status',
              in: {
                label: '$$status.status',
                value: {
                  $multiply: [
                    { $divide: ['$$status.count', '$totalTask'] },
                    100,
                  ],
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

  async findOne(id: string) {
    return await this.boardModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
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
    ]);
  }

  update(id: number, updateBoardDto: UpdateBoardDto) {
    return `This action updates a #${id} board`;
  }

  async remove(id: string) {
    try {
      const result = await this.boardModel.findByIdAndDelete(id);
      if (result) {
        await this.sectionModel.deleteMany({ board: id });
        await this.taskModel.deleteMany({ board: id });
        return result;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  }
}
