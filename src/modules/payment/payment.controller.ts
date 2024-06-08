import { Controller, Get, Param, Post } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { apiFailed } from "src/common/api-response";

@Controller('payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService
  ) {}

  @Post('/create-payment-link')
  async createPaymentLink() {
    try {
      return await this.paymentService.createPaymentLink();
    } catch (error) {
      throw apiFailed(error.statusCode, null, error.message);
    }
  }

  @Get('/info/:orderCode')
  async getInfoOrder(@Param('orderCode') orderCode: string) {
    try {
      return await this.paymentService.checkIdOrder(orderCode);
    } catch (error) {
      throw apiFailed(error.statusCode, null, error.message);
    }
  }
} 