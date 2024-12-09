import AWS from 'aws-sdk';

import Pubnub from 'pubnub';
import twilio, {Twilio} from 'twilio';
import {TwilioAuthConfig, TwilioMessage} from '../providers';
import Mail = require('nodemailer/lib/mailer');
import SMTPTransport = require('nodemailer/lib/smtp-transport');

export class MockSES {
  constructor(config: AWS.SES.Types.ClientConfiguration) {
    /* do nothing */
  }

  async sendEmail(emailReq: AWS.SES.SendEmailRequest) {
    /* do nothing */
  }
}

export class MockSNS {
  constructor(config: AWS.SNS.ClientConfiguration) {
    /* do nothing */
  }

  async publish(message: AWS.SNS.PublishInput) {
    /* do nothing */
  }
}

export class MockSocketIo {
  constructor(
    url: string,
    options?: {
      [key: string]: string;
    },
  ) {
    /* do nothing */
  }

  async emit(path: string, message: string) {
    /* do nothing */
  }
}

export class MockMail {
  constructor(config: SMTPTransport.Options) {
    /* do nothing */
  }

  async sendMail(message: Mail.Options) {
    /* do nothing */
  }
}

export class MockPubnub {
  constructor(config: Pubnub.PubNubConfiguration) {
    /* do nothing */
  }

  grant(grantConfig: Pubnub.PAM.GrantParameters) {
    /* do nothing */
  }
  async publish(publishConfig: Pubnub.Publish.PublishParameters) {
    /* do nothing */
  }
}

export class MockTwilio {
  twilioService: Twilio;
  constructor(config: TwilioAuthConfig) {
    this.twilioService = twilio(config.accountSid, config.authToken);
  }
  // sonarignore:start
  // this is intensional
  async publish(message: TwilioMessage) {
    /* do nothing */
  }
  // sonarignore:end
}
