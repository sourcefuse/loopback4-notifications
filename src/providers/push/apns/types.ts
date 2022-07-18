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
  // sonarignore:start
  options: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  // sonarignore:end
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
