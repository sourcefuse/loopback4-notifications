import {BindingKey} from '@loopback/core';
import {INotification, INotificationConfig} from './types';

export namespace NotificationBindings {
  export const NotificationProvider =
    BindingKey.create<INotification>('sf.notification');
  export const SMSProvider = BindingKey.create<INotification>(
    'sf.notification.sms',
  );
  export const PushProvider = BindingKey.create<INotification>(
    'sf.notification.push',
  );
  export const EmailProvider = BindingKey.create<INotification>(
    'sf.notification.email',
  );

  export const Config = BindingKey.create<INotificationConfig | null>(
    'sf.notification.config',
  );
}
