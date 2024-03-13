import Pubnub from 'pubnub';
import {Config} from '../../../types';
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

export enum PayloadType {
  Data,
  Notification,
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

export interface PnGcm {
  data?: MessageConfig;
  notification?: MessageConfig;
}

export interface PnApns {
  aps: Aps;
  pnPush: TargetsType[];
}

export interface Aps {
  alert: MessageConfig;
  key?: string;
  sound: string;
}

export interface TargetsType {
  version: string;
  targets: {
    environment?: string;
    topic?: string;
  }[];
}
export interface MessageConfig {
  title?: string;
  description: string;
}

export interface GeneralMessageType {
  pnApns: PnGcm;
}
export type PubnubConfig = PubnubAPNSConfig & Pubnub.PubnubConfig;
