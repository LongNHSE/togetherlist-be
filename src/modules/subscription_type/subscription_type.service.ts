import { Injectable } from '@nestjs/common';
import { CreateSubscriptionTypeDto } from './dto/create-subscription_type.dto';
import { UpdateSubscriptionTypeDto } from './dto/update-subscription_type.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SubscriptionType } from './schema/subscription_type.schema';
import { Model } from 'mongoose';

@Injectable()
export class SubscriptionTypeService {
  findFreeSub(arg0: { name: string }): any {
    return this.subscriptionTypeModel.findOne(arg0);
  }
  constructor(
    @InjectModel(SubscriptionType.name)
    private subscriptionTypeModel: Model<SubscriptionType>,
  ) {}
  create(createSubscriptionTypeDto: CreateSubscriptionTypeDto) {
    return this.subscriptionTypeModel.create(createSubscriptionTypeDto);
  }

  findAll() {
    return this.subscriptionTypeModel.find();
  }

  findOne(id: string) {
    return this.subscriptionTypeModel.findById(id);
  }

  update(id: number, updateSubscriptionTypeDto: UpdateSubscriptionTypeDto) {
    return `This action updates a #${id} subscriptionType`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscriptionType`;
  }
}
