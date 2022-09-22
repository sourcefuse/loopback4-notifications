import {
  INotification,
  Message,
  MessageOptions,
  Receiver,
  Subscriber,
} from '../../types';

export interface SMSNotification extends INotification {
  publish(message: SMSMessage): Promise<void>;
}

export interface SMSMessage extends Message {
  receiver: SMSReceiver;
  subject: undefined;
}

export interface SMSReceiver extends Receiver {
  to: SMSSubscriber[];
}

export interface SMSSubscriber extends Subscriber {}
export interface SMSMessageOptions extends MessageOptions {}
