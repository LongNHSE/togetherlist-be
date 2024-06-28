import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SubscriptionPlan,
  SubscriptionPlanSchema,
} from './schema/subscription-plan.shema';
import { SubscriptionPlanController } from './subscription-plan.controller';
import { SubscriptionPlanService } from './subscription-plan.service';
import { SubscriptionType } from '../subscription_type/schema/subscription_type.schema';
import { SubscriptionTypeModule } from '../subscription_type/subscription_type.module';
@Module({
  controllers: [SubscriptionPlanController],
  imports: [
    SubscriptionTypeModule,
    MongooseModule.forFeature([
      { name: SubscriptionPlan.name, schema: SubscriptionPlanSchema },
    ]),
  ],
  providers: [SubscriptionPlanService],
  exports: [SubscriptionPlanService],
})
export class SubscriptionPlanModule {}
