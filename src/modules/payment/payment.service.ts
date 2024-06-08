import { HttpException, Injectable } from "@nestjs/common";
import * as dotenv from 'dotenv';
import * as crypto from 'crypto';

dotenv.config();

type payloadType = {
  orderCode: number,
  amount: number,
  description: string,
  buyerName: string,
  buyerEmail: string,
  buyerPhone: string,
  items: any
}

const config = {
  PAYOS_CLIENT_ID: process.env.PAYOS_CLIENT_ID,
  PAYOS_API_KEY: process.env.PAYOS_API_KEY,
  PAYOS_CHECKSUM_KEY: process.env.PAYOS_CHECKSUM_KEY
}

@Injectable()
export class PaymentService {

  returnURL = 'http://localhost:3000/payos/return';
  cancelURL = 'http://localhost:3000/payos/cancel';

  constructor() { }

  async generateHmac(payload: payloadType) {
    var data = `amount=${payload.amount}&cancelUrl=${this.cancelURL}&description=${payload.description}&orderCode=${payload.orderCode}&returnUrl=${this.returnURL}`
    const checksum = config.PAYOS_CHECKSUM_KEY || '';
    const hmac = crypto.createHmac('sha256', checksum);
    hmac.update(data);
    return hmac.digest('hex');
  }

  async createPaymentLink(): Promise<any> {
    // setup payload
    const payload: payloadType = {
      orderCode: Date.now(),
      amount: 1000,
      description: 'Test Payment',
      buyerName: "NGUYEN ANH THOAI",
      buyerEmail: "thoai@gmail.com",
      buyerPhone: "0123456789",
      items: []
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
        "cancelUrl": this.cancelURL,
        "returnUrl": this.returnURL,
        "expiredAt": Math.floor(Date.now() / 1000) + (2 * 60), // 5 minutes
        "signature": hmac
      }),
    })
      .then(response => response.json())
      .then(data => {
        return data;
      })
      .catch((error) => {
        throw new HttpException(error, 400);
      });
  }

  async checkIdOrder(idOrder: string): Promise<any> {
    return fetch(`https://api-merchant.payos.vn/v2/payment-requests/${idOrder}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': config.PAYOS_CLIENT_ID || '',
        'x-api-key': config.PAYOS_API_KEY || '',
      },
    })
      .then(response => response.json())
      .then(data => {
        return data;
      })
      .catch((error) => {
        return JSON.stringify(error);
      });
  }
}