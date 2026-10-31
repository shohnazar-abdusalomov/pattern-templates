export class TelegramClient {
  sendTelegramMessage(chatId: string, text: string): void {
    console.log(`Sending Telegram message to ${chatId}: ${text}`);
  }
}
