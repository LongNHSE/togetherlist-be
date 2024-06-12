import { Injectable } from '@nestjs/common';
import { CreateReportTaskDto } from './dto/create-report-task.dto';
import { UpdateReportTaskDto } from './dto/update-report-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ReportTask } from './schema/report-task.schema';
import mongoose, { Model } from 'mongoose';
import { ChangeStream, ChangeStreamDocument } from 'mongodb';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { MailService } from 'src/modules/mail/mail.service';
import { MemberService } from 'src/modules/member/member.service';

@Injectable()
export class ReportTaskService {
  private changeStream: ChangeStream<ChangeStreamDocument<ReportTask>>;
  private jobMap = new Map<string, string>(); // Map to store task ID to job ID

  async onModuleInit() {
    this.changeStream = this.reportTaskModel.watch([], {
      fullDocument: 'updateLookup',
      fullDocumentBeforeChange: 'required',
    });
    this.changeStream.on('change', async (change: any) => {
      if (change.documentKey._id) {
        const reportTask = await this.findById(change.documentKey._id);
        if (reportTask) {
          this.scheduleNotification(reportTask[0]);
        }
      }
    });
  }

  constructor(
    @InjectModel(ReportTask.name) private reportTaskModel: Model<ReportTask>,
    private mailService: MailService,
    private memberService: MemberService,
    @InjectQueue('report-task-queue') private reportTaskQueue: Queue,
  ) {}

  async scheduleNotification(reportTask: any) {
    // Cancel any existing job for this task
    if (this.jobMap.has(reportTask._id)) {
      const jobId = this.jobMap.get(reportTask._id);
      if (jobId) {
        const existingJob = await this.reportTaskQueue.getJob(jobId);
        if (existingJob) {
          await existingJob.remove();
        }
      }
    }
    // Schedule new notification job
    const job = await this.reportTaskQueue.add(
      'report-task-queue',
      { reportTask },
      { delay: 1 * 2 * 1000 }, // 3 minutes delay
    );
    // Store job ID in map
    if (job.id) {
      this.jobMap.set(reportTask, job.id);
    }
  }

  create(createReportTaskDto: CreateReportTaskDto) {
    return 'This action adds a new reportTask';
  }

  findAll() {
    return `This action returns all reportTask`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reportTask`;
  }

  findById(id: string) {
    return this.reportTaskModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'boards',
          localField: 'board',
          foreignField: '_id',
          as: 'board',
        },
      },
      {
        $unwind: '$board',
      },
      {
        $addFields: {
          newStatus: {
            $arrayElemAt: [
              {
                $filter: {
                  input: '$board.taskStatus',
                  as: 'status',
                  cond: {
                    $eq: ['$$status._id', '$newStatus'],
                  },
                },
              },
              0,
            ],
          },
          oldStatus: {
            $arrayElemAt: [
              {
                $filter: {
                  input: '$board.taskStatus',
                  as: 'status',
                  cond: {
                    $eq: ['$$status._id', '$oldStatus'],
                  },
                },
              },
              0,
            ],
          },
          workspace: '$board.workspace',
        },
      },
      {
        $addFields: {
          newStatus: '$newStatus.name',
          oldStatus: '$oldStatus.name',
        },
      },
      {
        $lookup: {
          from: 'workspaces',
          localField: 'workspace',
          foreignField: '_id',
          as: 'workspace',
        },
      },
      {
        $unwind: '$workspace',
      },
      {
        $lookup: {
          from: 'users',
          localField: 'assignee',
          foreignField: '_id',
          as: 'assignee',
        },
      },
      {
        $unwind: '$assignee',
      },
      {
        $lookup: {
          from: 'tasks',
          localField: 'task',
          foreignField: '_id',
          as: 'task',
        },
      },
      {
        $unwind: '$task',
      },
      // {
      //   $unset: [
      //     'board.taskStatus',
      //     'workspace._id',
      //     'assignee._id',
      //     'task._id',
      //   ],
      // },
    ]);
  }

  update(id: number, updateReportTaskDto: UpdateReportTaskDto) {
    return `This action updates a #${id} reportTask`;
  }

  remove(id: number) {
    return `This action removes a #${id} reportTask`;
  }

  async sendNotification(reportTask: any) {
    const member = await this.memberService.findAll(reportTask.workspace._id);
    await this.mailService.sendReportTask(reportTask, member);
  }
}
