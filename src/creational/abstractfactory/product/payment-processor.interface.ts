export interface PaymentProcessor {
  pay(decimal: number): void;
}
