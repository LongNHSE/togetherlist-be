import { Injectable } from '@nestjs/common';
import { Invoice } from './schema/invoice.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class InvoiceService {
  findByOrderCode(orderCode: number) {
    return this.invoiceModel.findOne({ orderCode: orderCode });
  }
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
  ) {}

  create(invoice: any) {
    return this.invoiceModel.create(invoice);
  }

  findById(id: string) {
    return this.invoiceModel.findById(id);
  }
}
