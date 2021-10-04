import {inject, Provider} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {SNS} from '../../../types/aws-sdk';
import {loadDynamic} from '../../dynamic-loader';
import {SNSBindings} from './keys';
import {SNSMessage, SNSNotification, SNSSubscriberType} from './types';

export class SnsProvider implements Provider<SNSNotification> {
  constructor(
    @inject(SNSBindings.Config, {
      optional: true,
    })
    private readonly snsConfig?: SNS.ClientConfiguration,
  ) {}

  snsService: SNS;

  async value() {
    const AWS = await loadDynamic('aws-sdk');
    const errorMessage =
      'Cannot use Amazon SNS service!' +
      '\n' +
      'Please install aws-sdk before using this service.' +
      '\n' +
      'Run `npm install --save aws-sdk` to install AWS SDK.';

    if (!AWS) {
      console.error(errorMessage);
      return {
        publish: async (message: SNSMessage) => {
          console.error(errorMessage);
          throw new HttpErrors.ServiceUnavailable('SMS service unavailable');
        },
      };
    } else {
      this.snsService = new AWS.SES(this.snsConfig);
    }

    return {
      publish: async (message: SNSMessage) => {
        if (message.receiver.to.length === 0) {
          throw new HttpErrors.BadRequest(
            'Message receiver not found in request',
          );
        }

        const publishes = message.receiver.to.map(receiver => {
          const msg: SNS.PublishInput = {
            Message: message.body,
            Subject: message.subject,
          };
          if (message.options?.smsType) {
            msg.MessageAttributes = {
              'AWS.SNS.SMS.SMSType': {
                DataType: 'String',
                StringValue: message.options.smsType,
              },
            };
          }
          if (receiver.type === SNSSubscriberType.PhoneNumber) {
            msg.PhoneNumber = receiver.id;
          } else if (receiver.type === SNSSubscriberType.Topic) {
            msg.TopicArn = receiver.id;
          } else {
            // Do nothing
          }

          return this.snsService.publish(msg).promise();
        });

        await Promise.all(publishes);
      },
    };
  }
}
