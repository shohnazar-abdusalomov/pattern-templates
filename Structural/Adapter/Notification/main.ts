import { SmsNotificationService } from './sms-notification.service.js';
import { TelegramClient } from './telegram-client.js';
import { EmailClient } from './email-client.js';
import { TelegramAdapter } from './telegram-adapter.js';
import { EmailAdapter } from './email-adapter.js';
import { NotificationManager } from './notification-manager.js';

export class Main {
  public static main(): void {
    const smsService = new SmsNotificationService();
    const telegramClient = new TelegramClient();
    const emailClient = new EmailClient();

    const telegramAdapter = new TelegramAdapter(telegramClient);
    const emailAdapter = new EmailAdapter(emailClient);

    const manager = new NotificationManager(smsService);
    manager.sendNotification('+998901234567', 'Tasdiqlash kodi: 7894');

    manager.setService(telegramAdapter);
    manager.sendNotification('@shohnazar_dev', 'Profilingizga yangi kirish qayd etildi.');

    manager.setService(emailAdapter);
    manager.sendNotification('user@example.com', 'Hisobingiz muvaffaqiyatli faollashtirildi.');
  }
}

if (process.argv[1]?.includes('main') || process.argv[1]?.includes('Notification')) {
  Main.main();
}
