import {BindingKey} from '@loopback/core';
import {SNS} from '../../../types/aws-sdk';

export namespace SNSBindings {
  export const Config = BindingKey.create<SNS.ClientConfiguration | null>(
    'sf.notification.config.sns',
  );
}
