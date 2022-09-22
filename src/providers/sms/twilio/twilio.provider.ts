import {inject, Provider} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import twilio, {Twilio} from 'twilio';
import {TwilioBindings} from './keys';

import {
  TwilioAuthConfig,
  TwilioCreateMessageParams,
  TwilioMessage,
  TwilioNotification,
  TwilioSubscriberType,
} from '../twilio/types';

export class TwilioProvider implements Provider<TwilioNotification> {
  twilioService: Twilio;
  constructor(
    @inject(TwilioBindings.Config, {
      optional: true,
    })
    private readonly twilioConfig?: TwilioAuthConfig,
  ) {
    if (this.twilioConfig) {
      this.twilioService = twilio(
        this.twilioConfig.accountSid,
        this.twilioConfig.authToken,
      );
    } else {
      throw new HttpErrors.PreconditionFailed('Twilio Config missing !');
    }
  }

  value() {
    return {
      publish: async (message: TwilioMessage) => {
        if (message.receiver.to.length === 0) {
          throw new HttpErrors.BadRequest(
            'Message receiver not found in request',
          );
        }
        const publishes = message.receiver.to.map(async receiver => {
          const msg: string = message.body;
          const twilioMsgObj: TwilioCreateMessageParams = {
            body: msg,
            from:
              receiver.type &&
              receiver.type === TwilioSubscriberType.TextSMSUser
                ? String(this.twilioConfig?.smsFrom)
                : String(this.twilioConfig?.waFrom),
            to:
              receiver.type &&
              receiver.type === TwilioSubscriberType.TextSMSUser
                ? `+${receiver.id}`
                : `whatsapp:+${receiver.id}`,
          };

          // eslint-disable-next-line no-unused-expressions
          !receiver.type &&
            message.mediaUrl &&
            (twilioMsgObj.mediaUrl = message.mediaUrl);

          // eslint-disable-next-line no-unused-expressions
          receiver.type &&
            receiver.type === TwilioSubscriberType.TextSMSUser &&
            this.twilioConfig?.statusCallback &&
            (twilioMsgObj.statusCallback = this.twilioConfig?.statusCallback);

          return this.twilioService.messages.create(twilioMsgObj);
        });
        await Promise.all(publishes);
      },
    };
  }
}
