import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Board } from './schema/board.schema';
import mongoose, { Model } from 'mongoose';
import { Section } from '../section/schema/section.schema';
import { Task } from '../task/schema/task.schema';
import { UpdateBoardStatusDto } from './dto/update-board-status.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<Board>,
    @InjectModel(Section.name) private sectionModel: Model<Section>,
    @InjectModel(Task.name) private taskModel: Model<any>,
  ) {}

  updateBoardStatus(id: string, updateBoardStatusDto: UpdateBoardStatusDto) {
    const result = this.boardModel.updateOne(
      {
        _id: id,
        'taskStatus.index': updateBoardStatusDto.oldIndex,
      },
      {
        $set: {
          'taskStatus.$.name': updateBoardStatusDto.name,
          'taskStatus.$.color': updateBoardStatusDto.color,
          'taskStatus.$.index': updateBoardStatusDto.newIndex,
        },
      },
    );
    this.boardModel.updateOne(
      {
        _id: id,
        'taskStatus.index': updateBoardStatusDto.newIndex,
      },
      {
        $set: {
          'taskStatus.$.index': updateBoardStatusDto.oldIndex,
        },
      },
    );
    return result;
  }
  //Test1
  // async findBoardsByWorkspaceId(workspaceId: string) {
  //   console.log(workspaceId);
  //   return await this.boardModel.aggregate([
  //     {
  //       $match: {
  //         workspace: new mongoose.Types.ObjectId(workspaceId),
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'sections',
  //         localField: 'sections',
  //         foreignField: '_id',
  //         as: 'sections',
  //         pipeline: [
  //           {
  //             $lookup: {
  //               from: 'tasks',
  //               localField: '_id',
  //               foreignField: 'section',
  //               as: 'tasks',
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     {
  //       $unwind: {
  //         path: '$sections',
  //         preserveNullAndEmptyArrays: true,
  //       },
  //     },
  //     {
  //       $unwind: {
  //         path: '$sections.tasks',
  //         preserveNullAndEmptyArrays: true,
  //       },
  //     },
  //     {
  //       $group: {
  //         _id: {
  //           boardId: '$_id',
  //           boardName: '$name',
  //           createdAt: '$createdAt',
  //           status: '$taskStatus',
  //           taskStatus: {
  //             $cond: {
  //               if: {
  //                 $gt: [
  //                   {
  //                     $type: '$sections.tasks',
  //                   },
  //                   'missing',
  //                 ],
  //               },
  //               then: '$sections.tasks.status',
  //               else: null,
  //             },
  //           },
  //         },
  //         taskCount: {
  //           $sum: {
  //             $cond: {
  //               if: {
  //                 $gt: [
  //                   {
  //                     $type: '$sections.tasks',
  //                   },
  //                   'missing',
  //                 ],
  //               },
  //               then: 1,
  //               else: 0,
  //             },
  //           },
  //         },
  //       },
  //     },
  //     {
  //       $group: {
  //         _id: {
  //           boardId: '$_id.boardId',
  //           boardName: '$_id.boardName',
  //           createdAt: '$_id.createdAt',
  //           taskStatus: '$_id.status',
  //         },
  //         totalTask: {
  //           $sum: '$taskCount',
  //         },
  //         statuses: {
  //           $push: {
  //             status: '$_id.taskStatus',
  //             count: '$taskCount',
  //           },
  //         },
  //       },
  //     },
  //     {
  //       $project: {
  //         taskStatus: '$_id.taskStatus',
  //         _id: '$_id.boardId',
  //         name: '$_id.boardName',
  //         createdAt: '$_id.createdAt',
  //         totalTask: '$totalTask',
  //         statuses: {
  //           $map: {
  //             input: '$statuses',
  //             as: 'status',
  //             in: {
  //               label: '$$status.status',
  //               value: {
  //                 $cond: {
  //                   if: {
  //                     $gt: ['$$status.count', 0],
  //                   },
  //                   then: {
  //                     $multiply: [
  //                       {
  //                         $divide: ['$$status.count', '$totalTask'],
  //                       },
  //                       100,
  //                     ],
  //                   },
  //                   else: 0,
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //     {
  //       $addFields: {
  //         statuses: {
  //           $cond: {
  //             if: {
  //               $eq: [
  //                 {
  //                   $size: '$statuses',
  //                 },
  //                 0,
  //               ],
  //             },
  //             then: [],
  //             else: '$statuses',
  //           },
  //         },
  //       },
  //     },
  //     {
  //       $sort: {
  //         createdAt: 1, // Sort by createdAt in ascending order. Use -1 for descending order.
  //       },
  //     },
  //   ]);
  // }
  async findBoardsByWorkspaceId(workspaceId: string) {
    console.log(workspaceId);
    const result = await this.boardModel.aggregate([
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
          totalTask: '$totalTask',
          statuses: {
            $map: {
              input: '$statuses',
              as: 'status',
              in: {
                label: '$$status.status',
                percentage: {
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
        $lookup: {
          from: 'boards',
          let: {
            statusIds: '$statuses.label',
          },
          pipeline: [
            {
              $unwind: '$taskStatus',
            },
            {
              $match: {
                $expr: {
                  $in: ['$taskStatus._id', '$$statusIds'],
                },
              },
            },
            {
              $group: {
                _id: '$_id',
                taskStatus: {
                  $push: '$taskStatus',
                },
              },
            },
          ],
          as: 'statusDetails',
        },
      },
      {
        $unwind: '$statusDetails',
      },
      {
        $addFields: {
          statuses: {
            $map: {
              input: '$statuses',
              as: 'status',
              in: {
                label: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: '$statusDetails.taskStatus',
                        as: 'detail',
                        cond: {
                          $eq: ['$$detail._id', '$$status.label'],
                        },
                      },
                    },
                    0,
                  ],
                },
                percentage: '$$status.percentage',
              },
            },
          },
        },
      },
      {
        $project: {
          taskStatus: 1,
          _id: 1,
          name: 1,
          totalTask: 1,
          statuses: 1,
        },
      },
      {
        $sort: {
          createdAt: 1, // Sort by createdAt in ascending order. Use -1 for descending order.
        },
      },
    ]);

    if (result.length > 0) {
      result.forEach((board) => {
        board.statuses = board.statuses.map((status: any) => {
          const { name, color, _id } = status.label;
          status = { label: name, color, _id, value: status.percentage };
          return status;
        });
      });
    }

    return result;
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
