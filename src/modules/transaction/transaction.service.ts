import { Injectable } from '@nestjs/common';
import { Transaction } from './schema/transaction.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
  ) {}
  create(transactionPayload: Transaction) {
    return this.transactionModel.create(transactionPayload);
  }
}
