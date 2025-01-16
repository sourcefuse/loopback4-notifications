import {BindingKey} from '@loopback/core';

export namespace SendGridBindings {
  export const Config = BindingKey.create<SendGridConfig | null>(
    'sf.notification.config.sendgrid',
  );
}

export interface SendGridConfig {
  apiKey: string;
  fromEmail: string;
}
