import { HttpException, Injectable } from '@nestjs/common';
import { WebhookHandler } from './webhook-handler.interface';
import { InvoiceService } from '../invoice/invoice.service';
import { SubscriptionPlanService } from '../subscription-plan/subscription-plan.service';
import { SubscriptionTypeService } from '../subscription_type/subscription_type.service';
import { TransactionService } from '../transaction/transaction.service';
import { UserService } from '../user/user.service';

@Injectable()
export class WebhookHandlerService implements WebhookHandler {
  constructor(
    private userService: UserService,
    private subcriptionTypeService: SubscriptionTypeService,
    private subscriptionPlanService: SubscriptionPlanService,
    private transactionService: TransactionService,
    private invoiceService: InvoiceService,
  ) {}
  async handleWebhook(transaction: any): Promise<void> {
    const invoice = await this.invoiceService.findByOrderCode(
      transaction.orderCode,
    );
    if (!invoice) {
      throw new HttpException('Invoice not found', 400);
    }

    if (transaction.code === '00') {
      const transactionPayload: any = {
        userId: invoice.userId,
        amount: invoice.totalAmount,
        invoiceId: invoice._id.toString(),
        paymentMethod: 'Payos',
        status: 'Success',
      };
      await this.transactionService.create(transactionPayload);
      await this.subscriptionPlanService.createSubscriptionPlan(
        invoice.userId,
        invoice.subscriptionPlanId,
      );
      invoice.status = 'Paid';
      await invoice.save();
    }
  }
}
