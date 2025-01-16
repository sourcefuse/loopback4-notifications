import {EmailMessage, EmailNotification, EmailSubscriber} from '../types';

export interface SendGridNotification extends EmailNotification {
  publish(message: SendGridMessage): Promise<void>;
}

export interface SendGridMessage extends EmailMessage {
  receiver: SendGridReceiver;
}

export interface SendGridReceiver {
  to: EmailSubscriber[];
}
