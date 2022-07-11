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
  text?:string;
  html?:string;
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

export interface MessageOptions {
  // sonarignore:start
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  // sonarignore:end
}

export interface Subscriber {
  id: string;
  name?: string;
  // sonarignore:start
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  // sonarignore:end
}

export interface Receiver {
  to: Subscriber[];
}

export const enum MessageType {
  Push,
  Email,
  SMS,
}
