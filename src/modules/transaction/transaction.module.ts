import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, transactionSchema } from './schema/transaction.schema';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  controllers: [TransactionController],
  imports: [
    MongooseModule.forFeature([{ name: Transaction.name, schema: transactionSchema }]),
  ],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
