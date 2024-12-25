import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { apiFailed } from 'src/common/api-response';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorator';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/create-payment-link')
  @UseGuards(AuthGuard('jwt'))
  async createPaymentLink(@Body() body: any, @GetUser() user: any) {
    try {
      return await this.paymentService.createPaymentLink(
        body.subscriptionTypeId,
        user.userId,
      );
    } catch (error) {
      throw apiFailed(error.statusCode, null, error.message);
    }
  }
  @Post('/webhook')
  async handleWebhook(@Body() body: any) {
    try {
      console.log('Webhook received:', body);
      if (!body.data.orderCode) {
        return apiFailed(400, null, 'Order code is required');
      }

      return await this.paymentService.handleWebHook(body.data);
    } catch (error) {
      throw apiFailed(error.statusCode, null, error.message);
    }
  }
  @Get('/webhook')
  async get() {
    try {
      return { message: 'Webhook received successfully' };
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
