// import Pubnub from 'pubnub';
import {Config} from '../../../types';
import {PubnubConfig} from '../../../types/pubnub';
import {
  PushMessage,
  PushNotification,
  PushReceiver,
  PushSubscriber,
} from '../types';

export interface PubNubNotification extends PushNotification {
  publish(message: PubNubMessage): Promise<void>;
  grantAccess(config: Config): Promise<{}>;
  revokeAccess(config: Config): Promise<{}>;
}

export interface PubNubMessage extends PushMessage {
  receiver: PubNubReceiver;
}

export interface PubNubGrantRequest extends Config {
  receiver: PubNubReceiver;
  options?: {
    token?: string;
    ttl?: number;
  };
}

export interface PubNubReceiver extends PushReceiver {
  to: PubNubSubscriber[];
}

export interface PubNubSubscriber extends PushSubscriber {
  type: PubNubSubscriberType;
  id: string;
}

export const enum PubNubSubscriberType {
  Channel,
}

export interface PubnubAPNSConfig {
  apns2Env?: string;
  apns2BundleId?: string;
}

type PubnubConfigWithAPNS = PubnubAPNSConfig & PubnubConfig;

export {PubnubConfigWithAPNS as PubnubConfig};
