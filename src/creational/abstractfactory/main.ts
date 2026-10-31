import { CheckoutService } from './client/checkout-service.js';
import { ClickFactory } from './factory/click-factory.js';
import { PaymeFactory } from './factory/payme-factory.js';

export function runAbstractFactoryDemo(): void {
  console.log('=== Abstract Factory Pattern Demo ===');
  const clickProcessor = new CheckoutService(new ClickFactory());
  clickProcessor.pay(100);
  clickProcessor.refund(50);

  const paymeProcessor = new CheckoutService(new PaymeFactory());
  paymeProcessor.pay(100);
  paymeProcessor.refund(50);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runAbstractFactoryDemo();
}
