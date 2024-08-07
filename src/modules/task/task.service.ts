import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './schema/task.schema';
import mongoose, { Model } from 'mongoose';
import { Section } from '../section/schema/section.schema';
import { Board } from '../board/schema/board.schema';
import { ChangeStream, ChangeStreamDocument } from 'mongodb';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ReportTask } from 'src/modules/report-task/schema/report-task.schema';

@Injectable()
export class TaskService implements OnModuleInit {
  updateTaskAssigneeRemove(workspaceId: string, memberId: string) {
    return this.taskModel.updateMany(
      {
        $and: [
          { assignee: new mongoose.Types.ObjectId(memberId) },
          { workspace: new mongoose.Types.ObjectId(workspaceId) },
        ],
      },
      { $set: { assignee: null } },
    );
  }
  async getReportWeek(boardId: string, year: string, month: string) {
    let data = await this.taskModel.aggregate([
      {
        $match: {
          board: new mongoose.Types.ObjectId(boardId),
        },
      },
      {
        $lookup: {
          from: 'boards', // Reference the correct collection
          localField: 'status', // The field from the tasks collection
          foreignField: 'taskStatus._id', // The nested field in the boards collection
          as: 'statusDetails', // Alias for the resulting array
        },
      },
      {
        $unwind: {
          path: '$statusDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          status: {
            $arrayElemAt: [
              {
                $filter: {
                  input: '$statusDetails.taskStatus',
                  as: 'taskStatus',
                  cond: { $eq: ['$$taskStatus._id', '$status'] },
                },
              },
              0,
            ],
          },
        },
      },
      {
        $project: {
          statusDetails: 0, // Optionally remove the temporary statusDetails field
        },
      },
    ]);
    data.forEach((task) => {
      const taskDate = new Date(task.createdAt);
      const taskYear = taskDate.getFullYear();
      const taskMonth = taskDate.getMonth() + 1; // getMonth is zero-based
      const taskWeek = Math.ceil(taskDate.getDate() / 7); // Rough estimation of the week in the month
      task.year = taskYear;
      task.month = taskMonth;
      task.week = taskWeek;
    });

    data = data.filter((task) => {
      return task.year === parseInt(year) && task.month === parseInt(month);
    });

    return data;
  }
  private changeStream: ChangeStream<ChangeStreamDocument<Task>>;
  private jobMap = new Map<string, string>(); // Map to store task ID to job ID

  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
    @InjectModel(Section.name) private readonly sectionModel: Model<Section>,
    @InjectModel(Board.name) private boardModel: Model<Board>,
    @InjectModel(ReportTask.name) private reportTaskModel: Model<ReportTask>,
    @InjectQueue('task-queue') private taskQueue: Queue,
  ) {}
  async onModuleInit() {
    this.changeStream = this.taskModel.watch([], {
      fullDocument: 'updateLookup',
      fullDocumentBeforeChange: 'required',
    });
    this.changeStream.on(
      'change',
      async (change: ChangeStreamDocument<Task>) => {
        console.log(change);
        if (
          change.operationType === 'update' &&
          change.updateDescription &&
          change.updateDescription.updatedFields &&
          change.fullDocument &&
          change.fullDocumentBeforeChange
        ) {
          const task: Task = change.fullDocument;
          const documentBeforeChange: Task = change.fullDocumentBeforeChange;

          //report task

          let newStatus = '';
          let newAssignee = '';
          if (change.updateDescription.updatedFields.status) {
            newStatus = change.updateDescription.updatedFields.status as string;
          }
          if (change.updateDescription.updatedFields.assignee) {
            newAssignee = change.updateDescription.updatedFields
              .assignee as string;
          }

          // eslint-disable-next-line prefer-const
          let reportTask: any = {
            board: task.board as string,
            task: task._id,
            oldStatus: documentBeforeChange.status,
            newStatus: '',
            assignee: '',
          };
          if (newStatus !== '') {
            reportTask.newStatus = newStatus;
            reportTask.isNewStatus = true;
          } else {
            reportTask.newStatus = documentBeforeChange.status;
          }

          if (newAssignee !== '') {
            reportTask.assignee = newAssignee;
            reportTask.isNewAssignee = true;
          } else {
            reportTask.assignee = documentBeforeChange.assignee as string;
          }
          await this.reportTaskModel.findOneAndUpdate(
            { task: documentBeforeChange._id }, // Assuming _id is the identifier
            { $set: reportTask }, // Update the document
            { upsert: true, new: true }, // Options: upsert to create if not found, new to return the updated document
          );
        }
        if (change.operationType === 'insert' && change.fullDocument) {
          await this.reportTaskModel.create({
            task: change.fullDocument._id,
            board: change.fullDocument.board,
            oldStatus: change.fullDocument.status,
            newStatus: change.fullDocument.status,
            description: 'Task created',
            assignee: change.fullDocument.assignee,
            isNewAssignee: false,
            isNewStatus: false,
            isNewSchedule: false,
          });
        }
      },
    );
  }

  create(createTaskDto: CreateTaskDto) {
    return this.taskModel.create(createTaskDto);
  }

  findAll() {
    return `This action returns all task`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    try {
      if (updateTaskDto.section && updateTaskDto.section) {
        await this.sectionModel.updateOne(
          { _id: updateTaskDto?.section },
          { $pull: { tasks: id } },
        );
        await this.sectionModel.updateOne(
          { _id: updateTaskDto.section },
          { $push: { tasks: id } },
        );
      }
      return await this.taskModel
        .findByIdAndUpdate(id, updateTaskDto, {
          new: true,
          timestamps: true,
        })
        .populate('assignee');
    } catch (error) {
      console.log(error);
    }
  }

  async remove(id: string) {
    try {
      const result = await this.taskModel.findByIdAndDelete(id);
      if (result) {
        await this.sectionModel.updateOne(
          { _id: result.section },
          { $pull: { tasks: id } },
        );
        //The toltalTask should not change because it the index of the task
        // const result2 = await this.boardModel.updateOne(
        //   { _id: result.board },
        //   { $inc: { totalTask: -1 } },
        // );
        // console.log(result2);
        return result;
      }
    } catch (error) {
      console.log(error);
    }
  }

  sendNotification(taskId: string, assignedTo: string) {
    console.log(`Task ${taskId} has been assigned to ${assignedTo}`);
    // Add your notification logic here (e.g., email, SMS, push notification)
  }
}
