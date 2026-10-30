import { NotificationService } from './notification-service.interface.js';
import { EmailClient } from './email-client.js';

export class EmailAdapter implements NotificationService {
  private client: EmailClient;
  private defaultSubject: string;

  constructor(client: EmailClient, defaultSubject: string = 'Bildirishnoma') {
    this.client = client;
    this.defaultSubject = defaultSubject;
  }

  send(recipient: string, message: string): void {
    this.client.sendEmail(recipient, this.defaultSubject, message);
  }
}
