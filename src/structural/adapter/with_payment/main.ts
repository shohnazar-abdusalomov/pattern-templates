import { StripeApi } from './stripe-api.js';
import { StripePaymentAdapter } from './stripe-payment-adapter.js';

export function runPaymentAdapterDemo(): void {
  console.log('=== Payment Adapter (Stripe) Pattern Demo ===');
  const stripeApi = new StripeApi();
  const paymentProcessor = new StripePaymentAdapter(stripeApi, 11910);

  paymentProcessor.pay(23100);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runPaymentAdapterDemo();
}
