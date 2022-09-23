import {Twilio} from 'twilio';
import {
  SMSMessage,
  SMSMessageOptions,
  SMSNotification,
  SMSReceiver,
  SMSSubscriber,
} from '../types';

export interface TwilioNotification extends SMSNotification {
  publish(message: TwilioMessage): Promise<void>;
}

export interface TwilioMessage extends SMSMessage {
  receiver: TwilioReceiver;
  mediaUrl?: Array<string>;
}

export interface TwilioReceiver extends SMSReceiver {
  to: TwilioSubscriber[];
}

export interface TwilioSubscriber extends SMSSubscriber {
  type: TwilioSubscriberType;
}

export const enum TwilioSubscriberType {
  WhatsappUser = 0,
  TextSMSUser = 1,
}

export const enum TwilioSMSType {
  Whatapp = 'Whatapp',
  TextSMS = 'TextSMS',
}

export interface TwilioAuthConfig extends Twilio.TwilioClientOptions {
  authToken?: string;
  waFrom?: String; //Whatsapp channel or phone number
  smsFrom?: string; //From address of SMS twilio number or messaging SID
  waStatusCallback?: string; //Status callback url to get WA message status
  smsStatusCallback?: string; //Status callback url to get SMS status
  opts?: SMSMessageOptions;
}

export interface TwilioCreateMessageParams {
  body: string;
  from: string;
  to: string;
  mediaUrl?: Array<string>; //For whatsapp message with media
  statusCallback?: string;
}
