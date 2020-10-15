import {inject, Provider} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import * as nodemailer from 'nodemailer';
import {NotificationBindings} from '../../../keys';
import {INotificationConfig} from '../../../types';
import {NodemailerBindings} from './keys';
import {NodemailerMessage, NodemailerNotification} from './types';
import SMTPTransport = require('nodemailer/lib/smtp-transport');
import Mail = require('nodemailer/lib/mailer');

export class NodemailerProvider implements Provider<NodemailerNotification> {
  constructor(
    @inject(NotificationBindings.Config, {
      optional: true,
    })
    private readonly config?: INotificationConfig,
    @inject(NodemailerBindings.Config, {
      optional: true,
    })
    private readonly nodemailerConfig?: SMTPTransport.Options,
  ) {
    if (this.nodemailerConfig) {
      this.transporter = nodemailer.createTransport({
        ...this.nodemailerConfig,
      });
    } else {
      throw new HttpErrors.PreconditionFailed('Nodemailer Config missing !');
    }
  }

  transporter: Mail;

  value() {
    return {
      publish: async (message: NodemailerMessage) => {
        const fromEmail =
          (message.options && message.options.from) ||
          (this.config && this.config.senderEmail);

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

        if (this.config && this.config.sendToMultipleReceivers) {
          const receivers = message.receiver.to.map(receiver => receiver.id);
          const emailReq: Mail.Options = {
            ...message.options,
            from: fromEmail || '',
            to: receivers,
            subject: message.options?.subject ?? message.subject,
            text: message.options?.text ?? message.body,
            html: message.options?.html,
            attachments: message.options?.attachments,
          };
          await this.transporter.sendMail(emailReq);
        } else {
          const publishes = message.receiver.to.map(receiver => {
            const emailReq: Mail.Options = {
              ...message.options,
              from: fromEmail || '',
              to: receiver.id,
              subject: message.options?.subject ?? message.subject,
              text: message.options?.text ?? message.body,
              html: message.options?.html,
              attachments: message.options?.attachments,
            };
            return this.transporter.sendMail(emailReq);
          });

          await Promise.all(publishes);
        }
      },
    };
  }
}
