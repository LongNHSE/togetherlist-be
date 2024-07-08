import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SubscriptionPlan } from './schema/subscription-plan.shema';
import mongoose, { Model } from 'mongoose';
import { SubscriptionType } from '../subscription_type/schema/subscription_type.schema';
import { SubscriptionTypeService } from '../subscription_type/subscription_type.service';

@Injectable()
export class SubscriptionPlanService {
  constructor(
    @InjectModel(SubscriptionPlan.name)
    private subscriptionPlanModel: Model<SubscriptionPlan>,
    private readonly subscriptionTypeService: SubscriptionTypeService,
  ) {}
  findAll() {
    return this.subscriptionPlanModel.find();
  }

  findOne(id: string) {
    return this.subscriptionPlanModel.findById(id);
  }

  findMySubscriptionPlan(userId: string) {
    return this.subscriptionPlanModel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: 'subscriptiontypes', // Assuming the collection name is subscriptionTypes
          localField: 'subscriptionTypeId',
          foreignField: '_id',
          as: 'subscriptionType',
        },
      },
      { $unwind: '$subscriptionType' },
      { $limit: 1 }, // Assuming you want the latest subscription plan similar to findOne
    ]);
  }

  async createFreeSubscriptionPlan(userId: string) {
    const subscriptionType: SubscriptionType =
      await this.subscriptionTypeService.findFreeSub({ name: 'Free' });
    if (!subscriptionType) {
      return null;
    }
    return this.create(
      { userId, subscriptionTypeId: subscriptionType._id },
      subscriptionType,
    );
  }

  create(createSubscriptionPlanDto: any, subscriptionType: SubscriptionType) {
    if (subscriptionType.duration === -1) {
      createSubscriptionPlanDto.to = null;
    }
    const date = new Date();
    createSubscriptionPlanDto.from = date;

    if (subscriptionType.duration !== -1) {
      date.setMonth(date.getMonth() + subscriptionType.duration);
      createSubscriptionPlanDto.to = date;
    }

    return this.subscriptionPlanModel.create(createSubscriptionPlanDto);
  }
}
