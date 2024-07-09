import { Module } from '@nestjs/common';
import { SubscriptionTypeService } from './subscription_type.service';
import { SubscriptionTypeController } from './subscription_type.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SubscriptionType,
  SubscriptionTypeSchema,
} from './schema/subscription_type.schema';

@Module({
  controllers: [SubscriptionTypeController],
  imports: [
    MongooseModule.forFeature([
      { name: SubscriptionType.name, schema: SubscriptionTypeSchema },
    ]),
  ],
  providers: [SubscriptionTypeService],
  exports: [SubscriptionTypeService],
})
export class SubscriptionTypeModule {}
