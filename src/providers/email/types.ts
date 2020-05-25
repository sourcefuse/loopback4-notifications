import {INotification, Message, Receiver, Subscriber} from '../../types';

export interface EmailNotification extends INotification {
  publish(message: EmailMessage): Promise<void>;
}

export interface EmailMessage extends Message {
  receiver: EmailReceiver;
}

export interface EmailReceiver extends Receiver {
  to: EmailSubscriber[];
  cc?: EmailSubscriber[];
  bcc?: EmailSubscriber;
}

export interface EmailSubscriber extends Subscriber {}
