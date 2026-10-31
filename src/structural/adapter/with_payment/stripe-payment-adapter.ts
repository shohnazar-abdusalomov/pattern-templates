import { PaymentProcessor } from './payment-processor.interface.js';
import { StripeApi } from './stripe-api.js';

export class StripePaymentAdapter implements PaymentProcessor {
  constructor(
    private readonly stripeApi: StripeApi,
    private readonly exchangeRateToUsd: number = 12800
  ) {}

  pay(amountInUzs: number): void {
    const dollars = amountInUzs / this.exchangeRateToUsd;
    const cents = Math.round(dollars * 100);
    this.stripeApi.makeTransaction(cents);
  }
}
