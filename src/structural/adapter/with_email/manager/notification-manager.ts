import { NotificationService } from '../services/notification-service.interface.js';

export class NotificationManager {
  constructor(private readonly notificationService: NotificationService) {}

  sendNotification(recipient: string, message: string): void {
    this.notificationService.send(recipient, message);
  }
}
