import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { UserModule } from '../user/user.module';
import { SubscriptionTypeModule } from '../subscription_type/subscription_type.module';
import { SubscriptionPlanModule } from '../subscription-plan/subscription-plan.module';
import { TransactionModule } from '../transaction/transaction.module';
import { InvoiceModule } from '../invoice/invoice.module';

@Module({
  imports: [
    UserModule,
    SubscriptionTypeModule,
    SubscriptionPlanModule,
    TransactionModule,
    InvoiceModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
