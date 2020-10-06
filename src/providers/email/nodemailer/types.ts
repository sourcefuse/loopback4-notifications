import {EmailMessage, EmailNotification, EmailSubscriber} from '../types';
import Mail = require('nodemailer/lib/mailer');

export interface NodemailerNotification extends EmailNotification {
  publish(message: NodemailerMessage): Promise<void>;
}

export interface NodemailerMessage extends EmailMessage {
  /**
   * sample message with pdf attachment looks like
   *
   * {
   *   from: 'foo@bar.com',
   *   to: 'bar@foo.com',
   *   subject: 'An Attached File',
   *   text: 'Check out this attached pdf file',
   *   attachments: [{
   *     filename: 'file.pdf',
   *     path: 'C:/Users/Username/Desktop/somefile.pdf',
   *     contentType: 'application/pdf'
   *   }]
   * }
   */
  receiver: NodemailerReceiver;
  /**
   * subject and to fields will be populated from main message,
   * but this will override those values if passed
   *
   * reciever will be extracted from main message,
   * to column in options won't be considered
   *
   * 'from' will be a mandatory field without which this will be considered wrong
   *
   * if you want to pass hrml as body, append it to the options
   */
  options?: Mail.Options;
}

export interface NodemailerReceiver {
  to: EmailSubscriber[];
}
