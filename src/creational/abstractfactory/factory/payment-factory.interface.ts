import { PaymentProcessor } from '../product/payment-processor.interface.js';
import { RefundProcessor } from '../product/refund-processor.interface.js';

export interface PaymentFactory {
  createPaymentProcessor(): PaymentProcessor;
  createRefundProcessor(): RefundProcessor;
}
