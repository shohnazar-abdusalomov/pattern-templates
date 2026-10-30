import { NotificationService } from './notification-service.interface.js';

export class NotificationManager {
  private service: NotificationService;

  constructor(service: NotificationService) {
    this.service = service;
  }

  setService(service: NotificationService): void {
    this.service = service;
  }

  sendNotification(recipient: string, message: string): void {
    this.service.send(recipient, message);
  }
}
