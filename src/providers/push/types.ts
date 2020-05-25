import {INotification, Message, Receiver, Subscriber} from '../../types';

export interface PushNotification extends INotification {
  publish(message: PushMessage): Promise<void>;
}

export interface PushMessage extends Message {
  receiver: PushReceiver;
}

export interface PushReceiver extends Receiver {
  to: PushSubscriber[];
}

export interface PushSubscriber extends Subscriber {}
