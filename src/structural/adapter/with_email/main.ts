import { EmailAdapter } from './adapters/email-adapter.js';
import { TelegramAdapter } from './adapters/telegram-adapter.js';
import { EmailClient } from './client/email-client.js';
import { TelegramClient } from './client/telegram-client.js';
import { NotificationManager } from './manager/notification-manager.js';
import { SmsNotificationService } from './services/sms-notification-service.js';

export function runEmailAdapterDemo(): void {
  console.log('=== Notification Adapter Pattern Demo ===');
  const message = 'Hello, this is a notification message.';
  const recipient = 'Azamov';

  const emailClient = new EmailClient();
  const telegramClient = new TelegramClient();

  const emailAdapter = new EmailAdapter(emailClient);
  const telegramAdapter = new TelegramAdapter(telegramClient);

  emailAdapter.send(recipient, message);
  telegramAdapter.send(recipient, message);

  const notificationManagerWithEmail = new NotificationManager(emailAdapter);
  const notificationManagerWithTelegram = new NotificationManager(telegramAdapter);
  const notificationManagerWithSms = new NotificationManager(new SmsNotificationService());

  notificationManagerWithEmail.sendNotification(recipient, message);
  notificationManagerWithTelegram.sendNotification(recipient, message);
  notificationManagerWithSms.sendNotification(recipient, message);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runEmailAdapterDemo();
}
