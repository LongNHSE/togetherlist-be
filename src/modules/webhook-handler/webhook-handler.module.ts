import { Module } from '@nestjs/common';
import { InvoiceModule } from '../invoice/invoice.module';
import { PaymentController } from '../payment/payment.controller';
import { PaymentService } from '../payment/payment.service';
import { SubscriptionPlanModule } from '../subscription-plan/subscription-plan.module';
import { SubscriptionTypeModule } from '../subscription_type/subscription_type.module';
import { TransactionModule } from '../transaction/transaction.module';
import { UserModule } from '../user/user.module';
import { WebhookHandlerService } from './webhook-handler.service';
import { WebhookHandlerController } from './webhook-handler.controller';

@Module({
  imports: [
    UserModule,
    SubscriptionTypeModule,
    SubscriptionPlanModule,
    TransactionModule,
    InvoiceModule,
  ],
  controllers: [WebhookHandlerController],
  providers: [WebhookHandlerService],
})
export class WebhookHandlerModule {}
