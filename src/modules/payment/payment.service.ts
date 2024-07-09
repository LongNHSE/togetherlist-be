import { HttpException, Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as crypto from 'crypto';
import { UserService } from '../user/user.service';
import { SubscriptionTypeService } from '../subscription_type/subscription_type.service';
import { SubscriptionPlanService } from '../subscription-plan/subscription-plan.service';
import { TransactionService } from '../transaction/transaction.service';
import { InvoiceService } from '../invoice/invoice.service';
import { Invoice } from '../invoice/schema/invoice.schema';
import { Transaction } from '../transaction/schema/transaction.schema';

dotenv.config();

type TransactionDataType = {
  orderCode: number;
  amount: number;
  description: string;
  accountNumber: string;
  reference: string;
  transactionDateTime: string;
  paymentLinkId: string;
  code: string;
  desc: string;
  counterAccountBankId: string;
  counterAccountBankName: string;
  counterAccountName: string;
  counterAccountNumber: string;
  virtualAccountName: string;
  virtualAccountNumber: string;
  currency: string;
};

type payloadType = {
  orderCode: number;
  amount: number;
  description: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  items: any;
};

const config = {
  PAYOS_CLIENT_ID: process.env.PAYOS_CLIENT_ID,
  PAYOS_API_KEY: process.env.PAYOS_API_KEY,
  PAYOS_CHECKSUM_KEY: process.env.PAYOS_CHECKSUM_KEY,
};

@Injectable()
export class PaymentService {
  returnURL = process.env.RETURN_URL;
  cancelURL = process.env.CANCEL_URL;

  constructor(
    private userService: UserService,
    private subcriptionTypeService: SubscriptionTypeService,
    private subscriptionPlanService: SubscriptionPlanService,
    private transactionService: TransactionService,
    private invoiceService: InvoiceService,
  ) {}

  async generateHmac(payload: payloadType) {
    const data = `amount=${payload.amount}&cancelUrl=${this.cancelURL}&description=${payload.description}&orderCode=${payload.orderCode}&returnUrl=${this.returnURL}`;
    const checksum = config.PAYOS_CHECKSUM_KEY || '';
    const hmac = crypto.createHmac('sha256', checksum);
    hmac.update(data);
    return hmac.digest('hex');
  }

  async createPaymentLink(
    subcriptionTypeId: string,
    userId: string,
  ): Promise<any> {
    // setup payload
    const payload: payloadType = {
      orderCode: Date.now(),
      amount: 0,
      description: '',
      buyerName: '',
      buyerEmail: '',
      buyerPhone: '',
      items: [],
    };

    const user = await this.userService.findById(userId);
    const subscriptionType =
      await this.subcriptionTypeService.findOne(subcriptionTypeId);
    const invoicePayload: Invoice = {
      userId: userId,
      orderCode: payload.orderCode,
      subscriptionPlanId: subcriptionTypeId,
      totalAmount: subscriptionType?.price || 0,
      status: 'Sent',
      discountAmmount: 0,
      paymentMethod: 'Payos',
    };

    const invoice = await this.invoiceService.create(invoicePayload);
    if (!invoice) {
      throw new HttpException('Create invoice failed', 400);
    }
    // calculate amount
    payload.amount = invoice.totalAmount;
    payload.description = subscriptionType?.name || '';
    payload.buyerName = user?.username || '';
    payload.buyerEmail = user?.email || '';
    payload.buyerPhone = user?.phone || '';

    if (!subscriptionType) {
      throw new HttpException('Subscription type not found', 400);
    }
    if (!user) {
      throw new HttpException('User not found', 400);
    }

    // generate hmac
    const hmac = await this.generateHmac(payload);
    return await fetch('https://api-merchant.payos.vn/v2/payment-requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': config.PAYOS_CLIENT_ID || '',
        'x-api-key': config.PAYOS_API_KEY || '',
      },
      body: JSON.stringify({
        ...payload,
        cancelUrl: this.cancelURL,
        returnUrl: this.returnURL,
        expiredAt: Math.floor(Date.now() / 1000) + 2 * 60, // 5 minutes
        signature: hmac,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((error) => {
        throw new HttpException(error, 400);
      });
  }

  async checkIdOrder(idOrder: string): Promise<any> {
    return fetch(
      `https://api-merchant.payos.vn/v2/payment-requests/${idOrder}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': config.PAYOS_CLIENT_ID || '',
          'x-api-key': config.PAYOS_API_KEY || '',
        },
      },
    )
      .then((response) => response.json())
      .then((data) => {
        //Check logic data for update subcription status
        return data;
      })
      .catch((error) => {
        return JSON.stringify(error);
      });
  }

  async handleWebHook(transaction: TransactionDataType) {
    const invoice = await this.invoiceService.findByOrderCode(
      transaction.orderCode,
    );
    if (!invoice) {
      throw new HttpException('Invoice not found', 400);
    }

    if (transaction.code === '00') {
      const transactionPayload: Transaction = {
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
