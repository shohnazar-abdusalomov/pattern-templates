import { PaymentProcessor } from '../product/payment-processor.interface.js';
import { RefundProcessor } from '../product/refund-processor.interface.js';
import { PaymentFactory } from './payment-factory.interface.js';

class ClickPaymentProcessor implements PaymentProcessor {
  pay(decimal: number): void {
    console.log(`${decimal} amount paid by click`);
  }
}

class ClickRefundProcessor implements RefundProcessor {
  refund(decimal: number): void {
    console.log(`${decimal} amount refunded by click`);
  }
}

export class ClickFactory implements PaymentFactory {
  createPaymentProcessor(): PaymentProcessor {
    return new ClickPaymentProcessor();
  }

  createRefundProcessor(): RefundProcessor {
    return new ClickRefundProcessor();
  }
}
