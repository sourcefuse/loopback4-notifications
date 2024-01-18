import {inject, Provider} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {SES} from 'aws-sdk';
import {NotificationBindings} from '../../../keys';
import {INotificationConfig} from '../../../types';
import {SESBindings} from './keys';
import {SESMessage, SESNotification} from './types';

export class SesProvider implements Provider<SESNotification> {
  constructor(
    @inject(NotificationBindings.Config, {
      optional: true,
    })
    private readonly config?: INotificationConfig,
    @inject(SESBindings.Config, {
      optional: true,
    })
    private readonly sesConfig?: SES.Types.ClientConfiguration,
  ) {
    if (this.sesConfig) {
      this.sesService = new SES(this.sesConfig);
    } else {
      throw new HttpErrors.PreconditionFailed('AWS SES Config missing !');
    }
  }

  sesService: SES;

  value() {
    return {
      publish: async (message: SESMessage) => {
        const fromEmail =
          message.options?.fromEmail ?? this.config?.senderEmail;

        if (!fromEmail) {
          throw new HttpErrors.BadRequest(
            'Message sender not found in request',
          );
        }

        if (message.receiver.to.length === 0) {
          throw new HttpErrors.BadRequest(
            'Message receiver not found in request',
          );
        }
        if (!message.subject || !message.body) {
          throw new HttpErrors.BadRequest('Message data incomplete');
        }

        if (this.config?.sendToMultipleReceivers) {
          const receivers = message.receiver.to.map(receiver => receiver.id);
          const emailReq: SES.SendEmailRequest = {
            Source: fromEmail ?? '',
            Destination: {
              ToAddresses: receivers,
            },
            Message: {
              Subject: {
                Data: message.subject ?? '',
              },
              Body: {
                Html: {
                  Data: message.body || '',
                },
              },
            },
          };
          await this.sesService.sendEmail(emailReq).promise();
        } else {
          const publishes = message.receiver.to.map(receiver => {
            const emailReq: SES.SendEmailRequest = {
              Source: fromEmail ?? '',
              Destination: {
                ToAddresses: [receiver.id],
              },
              Message: {
                Subject: {
                  Data: message.subject ?? '',
                },
                Body: {
                  Html: {
                    Data: message.body || '',
                  },
                },
              },
            };
            return this.sesService.sendEmail(emailReq).promise();
          });

          await Promise.all(publishes);
        }
      },
    };
  }
}
