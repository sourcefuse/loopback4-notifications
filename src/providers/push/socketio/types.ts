import {
  PushMessage,
  PushNotification,
  PushReceiver,
  PushSubscriber,
} from '../types';

export interface SocketNotification extends PushNotification {
  publish(message: SocketMessage): Promise<void>;
}

export interface SocketMessage extends PushMessage {
  receiver: SocketReceiver;
}

export interface SocketReceiver extends PushReceiver {
  to: SocketSubscriber[];
}

export interface SocketSubscriber extends PushSubscriber {
  type: SocketSubscriberType;
  id: string;
}

export const enum SocketSubscriberType {
  Channel,
}

export interface SocketConfig {
  url: string;
  /**
   * Path represents the default socket server endpoint
   */
  defaultPath: string;
}
