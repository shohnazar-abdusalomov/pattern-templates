import { PaymentProcessor } from '../product/payment-processor.interface.js';
import { RefundProcessor } from '../product/refund-processor.interface.js';
import { PaymentFactory } from './payment-factory.interface.js';

class PaymePaymentProcessor implements PaymentProcessor {
  pay(decimal: number): void {
    console.log(`${decimal} amount payed by payme`);
  }
}

class PaymeRefundProcessor implements RefundProcessor {
  refund(decimal: number): void {
    console.log(`${decimal} amount refunded by payme`);
  }
}

export class PaymeFactory implements PaymentFactory {
  createPaymentProcessor(): PaymentProcessor {
    return new PaymePaymentProcessor();
  }

  createRefundProcessor(): RefundProcessor {
    return new PaymeRefundProcessor();
  }
}
