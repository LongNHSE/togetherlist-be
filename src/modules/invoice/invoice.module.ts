import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, invoiceSchema } from './schema/invoice.schema';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';

@Module({
  controllers: [InvoiceController],
  imports: [
    MongooseModule.forFeature([{ name: Invoice.name, schema: invoiceSchema }]),
  ],
  providers: [InvoiceService],
  exports: [InvoiceService],
})
export class InvoiceModule {}
