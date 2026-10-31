import { PaymentFactory } from '../factory/payment-factory.interface.js';
import { PaymentProcessor } from '../product/payment-processor.interface.js';
import { RefundProcessor } from '../product/refund-processor.interface.js';

export class CheckoutService {
  private readonly paymentProcessor: PaymentProcessor;
  private readonly refundProcessor: RefundProcessor;

  constructor(factory: PaymentFactory) {
    this.paymentProcessor = factory.createPaymentProcessor();
    this.refundProcessor = factory.createRefundProcessor();
  }

  pay(decimal: number): void {
    this.paymentProcessor.pay(decimal);
  }

  refund(decimal: number): void {
    this.refundProcessor.refund(decimal);
  }
}
