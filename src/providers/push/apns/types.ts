import {AnyObject} from '@loopback/repository';
import {ProviderOptions} from '@parse/node-apn';
import {
  PushMessage,
  PushNotification,
  PushReceiver,
  PushSubscriber,
} from '../types';

export interface ApnsNotification extends PushNotification {
  publish(message: ApnsMessage): Promise<void>;
}
export interface ApnsConfigType {
  providerOptions: ProviderOptions;

  options: {
    badge?: number;
    topic: string;
  };
}

export interface ApnsMessage extends PushMessage {
  receiver: ApnsReceiver;
  options: AnyObject;
}
export interface ApnsReceiver extends PushReceiver {
  to: ApnsSubscriber[];
}

export interface ApnsSubscriber extends PushSubscriber {
  type: ApnsSubscriberType;
  id: string;
}

export const enum ApnsSubscriberType {
  RegistrationToken,
}
