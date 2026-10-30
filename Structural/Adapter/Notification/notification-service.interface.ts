export interface NotificationService {
  send(recipient: string, message: string): void;
}
