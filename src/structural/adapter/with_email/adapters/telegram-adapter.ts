import { TelegramClient } from '../client/telegram-client.js';
import { NotificationService } from '../services/notification-service.interface.js';

export class TelegramAdapter implements NotificationService {
  constructor(public readonly telegramClient: TelegramClient) {}

  send(recipient: string, message: string): void {
    console.log(`Finding Telegram user with recipient: ${recipient}`);
    this.telegramClient.sendTelegramMessage(recipient, message);
  }
}
