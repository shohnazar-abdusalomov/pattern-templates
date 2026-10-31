export interface PaymentProcessor {
  pay(amountInUzs: number): void;
}
