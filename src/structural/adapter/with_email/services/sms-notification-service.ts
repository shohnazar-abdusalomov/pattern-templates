import { NotificationService } from './notification-service.interface.js';

export class SmsNotificationService implements NotificationService {
  send(recipient: string, message: string): void {
    console.log(`Sending SMS to ${recipient}: ${message}`);
  }
}
