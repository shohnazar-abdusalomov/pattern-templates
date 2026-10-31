import { EmailClient } from '../client/email-client.js';
import { NotificationService } from '../services/notification-service.interface.js';

export class EmailAdapter implements NotificationService {
  constructor(private readonly emailClient: EmailClient) {}

  send(recipient: string, message: string): void {
    const subject = 'Notification';
    this.emailClient.sendEmail(recipient, subject, message);
  }
}
