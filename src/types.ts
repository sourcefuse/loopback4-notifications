import {AnyObject} from '@loopback/repository';
export interface INotification {
  publish(message: Message): Promise<void>;
}

export interface INotificationConfig {
  sendToMultipleReceivers: boolean;
  senderEmail?: string;
}

export interface Message {
  subject?: string;
  body: string;
  receiver: Receiver;
  sentDate: Date;
  type: MessageType;
  options?: MessageOptions;
}

export interface Config {
  receiver: Receiver;
  type: MessageType;
  options?: MessageOptions;
}

export type MessageOptions = AnyObject;

export interface Subscriber {
  id: string;
  name?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; //NOSONAR
}

export interface Receiver {
  to: Subscriber[];
}

export const enum MessageType {
  Push,
  Email,
  SMS,
}
