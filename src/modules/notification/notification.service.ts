import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from './schema/notification.schema';
import mongoose, { Model } from 'mongoose';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  createAssigneeNotificationWorker(reportTask: any, members: any[]) {
    const notification: Notification = {
      assignee: reportTask.assignee,
      newStatus: null,
      oldStatus: null,
      workspace: reportTask.workspace._id,
      task: reportTask.task._id,
      to: '',
      isNewAssignee: true,
      isNewStatus: false,
      status: 'unread',
    };
    members.forEach(async (member: any, index: number) => {
      notification.to = member.memberId;
      const result = await this.notificationModel.create(notification);
      const task = await this.getOneNotification(result._id.toString());
      // this.notificationGateway.notifyEvent(task[0]);
    });
  }
  updateStatus(id: string, arg1: any) {
    return this.notificationModel.findByIdAndUpdate(id, arg1, { new: true });
  }
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
    private readonly notificationGateway: NotificationGateway,
  ) {}
  createNotificationWorker(reportTask: any, members: any) {
    const notification: Notification = {
      workspace: reportTask.workspace._id,
      oldStatus: reportTask.oldStatus,
      newStatus: reportTask.newStatus,
      assignee: undefined,
      task: reportTask.task._id,
      to: '',
      isNewAssignee: false,
      isNewStatus: true,
      status: 'unread',
    };
    members.forEach(async (member: any, index: number) => {
      notification.to = member.memberId;
      const result = await this.notificationModel.create(notification);
      const task = await this.getOneNotification(result._id.toString());
      // this.notificationGateway.notifyEvent(task[0]);
    });
  }
  createNotification(notificationDto: any) {
    return this.notificationModel.create(notificationDto);
  }

  getAllNotification() {
    return this.notificationModel.find();
  }

  getOneNotification(id: string) {
    return this.notificationModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
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
        $unwind: {
          path: '$workspace',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'to',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
        },
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
        $unwind: {
          path: '$task',
        },
      },
    ]);
  }

  getMyNotification(page: number, limit: number, userId: string) {
    return this.notificationModel.aggregate([
      {
        $match: {
          to: new mongoose.Types.ObjectId(userId),
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
        $unwind: {
          path: '$workspace',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'to',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
        },
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
        $unwind: {
          path: '$task',
        },
      },
      {
        $limit: limit,
      },
      {
        $skip: (page - 1) * limit,
      },
      { $sort: { createdAt: -1 } },
    ]);
  }
}
