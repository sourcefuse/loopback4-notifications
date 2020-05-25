import {
  SMSMessage,
  SMSNotification,
  SMSReceiver,
  SMSSubscriber,
} from '../types';

export interface SNSNotification extends SMSNotification {
  publish(message: SNSMessage): Promise<void>;
}

export interface SNSMessage extends SMSMessage {
  receiver: SNSReceiver;
}

export interface SNSReceiver extends SMSReceiver {
  to: SNSSubscriber[];
}

export interface SNSSubscriber extends SMSSubscriber {
  type: SNSSubscriberType;
}

export const enum SNSSubscriberType {
  PhoneNumber,
  Topic,
}

export const enum SNSSMSType {
  Promotional = 'Promotional',
  Transactional = 'Transactional',
}
