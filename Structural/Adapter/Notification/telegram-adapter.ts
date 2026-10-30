import { NotificationService } from './notification-service.interface.js';
import { TelegramClient } from './telegram-client.js';

export class TelegramAdapter implements NotificationService {
  private client: TelegramClient;

  constructor(client: TelegramClient) {
    this.client = client;
  }

  send(recipient: string, message: string): void {
    this.client.sendTelegramMessage(recipient, message);
  }
}
