import { Controller, Post, Body } from '@nestjs/common';
import { WebhookHandler } from './webhook-handler.interface';

@Controller('webhook-handler')
export class WebhookHandlerController {
  constructor(private readonly webhookHandler: WebhookHandler) {}

  @Post()
  async handleWebhook(@Body() payload: any): Promise<string> {
    try {
      await this.webhookHandler.handleWebhook(payload);
    } catch (err) {
      console.error('Webhook handler error:', err.message);
      return 'Webhook Handler Error';
    }

    return 'Webhook received successfully';
  }
}
