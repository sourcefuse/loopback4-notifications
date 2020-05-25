import {EmailMessage, EmailNotification, EmailSubscriber} from '../types';

export interface SESNotification extends EmailNotification {
  publish(message: SESMessage): Promise<void>;
}

export interface SESMessage extends EmailMessage {
  receiver: SESReceiver;
}

export interface SESReceiver {
  to: EmailSubscriber[];
}
