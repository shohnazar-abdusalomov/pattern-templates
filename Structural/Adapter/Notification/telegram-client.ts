export class TelegramClient {
  sendTelegramMessage(chatId: string, text: string): void {
    console.log(`[Telegram] Chat ID: ${chatId} | Matn: ${text}`);
  }
}
