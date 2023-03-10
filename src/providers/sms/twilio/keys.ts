import {BindingKey} from '@loopback/core';
import {TwilioAuthConfig} from '../twilio/types';

export namespace TwilioBindings {
  export const Config = BindingKey.create<TwilioAuthConfig | null>(
    'sf.notification.config.twilio',
  );
}
