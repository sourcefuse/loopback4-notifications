import {inject, Provider} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import sgMail, {MailDataRequired} from '@sendgrid/mail';
import {NotificationBindings} from '../../../keys';
import {INotificationConfig} from '../../../types';
import {SendGridBindings, SendGridConfig} from './keys';
import {SendGridMessage, SendGridNotification} from './types';

export class SendgridProvider implements Provider<SendGridNotification> {
  constructor(
    @inject(SendGridBindings.Config, {
      optional: true,
    })
    private readonly sendgridConfig: SendGridConfig,
    @inject(NotificationBindings.Config, {
      optional: true,
    })
    private readonly config?: INotificationConfig,
  ) {
    if (!this.sendgridConfig.apiKey) {
      throw new HttpErrors.PreconditionFailed('SendGrid API Key missing!');
    }

    sgMail.setApiKey(this.sendgridConfig.apiKey);
  }

  value() {
    return {
      publish: async (message: SendGridMessage) => {
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
          const emailReq: MailDataRequired = {
            to: receivers,
            from: fromEmail || '',
            subject: message.options?.subject ?? message.subject,
            text: message.options?.text ?? message.body,
            html: message.options?.html,
            attachments: message.options?.attachments,
          };
          await sgMail.sendMultiple(emailReq);
        } else {
          const publishes = message.receiver.to.map(receiver => {
            const emailReq: MailDataRequired = {
              to: receiver.id,
              from: fromEmail || '',
              subject: message.options?.subject ?? message.subject,
              text: message.options?.text ?? message.body,
              html: message.options?.html,
              attachments: message.options?.attachments,
            };
            return sgMail.send(emailReq);
          });

          await Promise.all(publishes);
        }
      },
    };
  }
}
