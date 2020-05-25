import {inject, Provider} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {SNS} from 'aws-sdk';
import {SNSBindings} from './keys';
import {SNSMessage, SNSNotification, SNSSubscriberType} from './types';

export class SnsProvider implements Provider<SNSNotification> {
  constructor(
    @inject(SNSBindings.Config, {
      optional: true,
    })
    private readonly snsConfig?: SNS.ClientConfiguration,
  ) {
    if (this.snsConfig) {
      this.snsService = new SNS(this.snsConfig);
    } else {
      throw new HttpErrors.PreconditionFailed('AWS SNS Config missing !');
    }
  }

  snsService: SNS;

  value() {
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
          if (message.options && message.options.smsType) {
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
