export class StripeApi {
  makeTransaction(amountInCents: number): void {
    console.log(`Stripe orqali to'lov muvaffaqiyatli o'tdi: ${amountInCents} sent`);
  }
}
