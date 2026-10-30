export class EmailClient {
  sendEmail(emailAddress: string, subject: string, body: string): void {
    console.log(`[Email] Manzil: ${emailAddress} | Mavzu: ${subject} | Xabar: ${body}`);
  }
}
