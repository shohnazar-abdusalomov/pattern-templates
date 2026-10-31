export class EmailClient {
  sendEmail(emailAddress: string, subject: string, body: string): void {
    console.log(`Sending email to ${emailAddress} with subjects: ${subject} and body: ${body}`);
  }
}
