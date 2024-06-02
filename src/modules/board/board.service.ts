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
            createdAt: '$createdAt',
            status: '$taskStatus',
            taskStatus: {
              $cond: {
                if: {
                  $gt: [
                    {
                      $type: '$sections.tasks',
                    },
                    'missing',
                  ],
                },
                then: '$sections.tasks.status',
                else: null,
              },
            },
          },
          taskCount: {
            $sum: {
              $cond: {
                if: {
                  $gt: [
                    {
                      $type: '$sections.tasks',
                    },
                    'missing',
                  ],
                },
                then: 1,
                else: 0,
              },
            },
          },
        },
      },
      {
        $group: {
          _id: {
            boardId: '$_id.boardId',
            boardName: '$_id.boardName',
            createdAt: '$_id.createdAt',
            taskStatus: '$_id.status',
          },
          totalTask: {
            $sum: '$taskCount',
          },
          statuses: {
            $push: {
              status: '$_id.taskStatus',
              count: '$taskCount',
            },
          },
        },
      },
      {
        $project: {
          taskStatus: '$_id.taskStatus',
          _id: '$_id.boardId',
          name: '$_id.boardName',
          createdAt: '$_id.createdAt',
          totalTask: '$totalTask',
          statuses: {
            $map: {
              input: '$statuses',
              as: 'status',
              in: {
                label: '$$status.status',
                value: {
                  $cond: {
                    if: {
                      $gt: ['$$status.count', 0],
                    },
                    then: {
                      $multiply: [
                        {
                          $divide: ['$$status.count', '$totalTask'],
                        },
                        100,
                      ],
                    },
                    else: 0,
                  },
                },
              },
            },
          },
        },
      },
      {
        $addFields: {
          statuses: {
            $cond: {
              if: {
                $eq: [
                  {
                    $size: '$statuses',
                  },
                  0,
                ],
              },
              then: [],
              else: '$statuses',
            },
          },
        },
      },
      {
        $sort: {
          createdAt: 1, // Sort by createdAt in ascending order. Use -1 for descending order.
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

  async create(createBoardDto: CreateBoardDto) {
    return await this.boardModel.create(createBoardDto);
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
