export interface WebhookHandler {
  handleWebhook(payload: any): Promise<void>;
}
