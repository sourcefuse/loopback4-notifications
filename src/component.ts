import {Binding, Component, ProviderMap} from '@loopback/core';
import {NotificationBindings} from './keys';
import {NotificationProvider} from './providers';
import {SESBindings} from './providers/email';
import {PubnubBindings} from './providers/push';
import {SNSBindings} from './providers/sms/sns';

export class NotificationsComponent implements Component {
  constructor() {}

  providers?: ProviderMap = {
    [NotificationBindings.NotificationProvider.key]: NotificationProvider,
  };

  bindings?: Binding[] = [
    Binding.bind(NotificationBindings.Config.key).to(null),
    Binding.bind(SESBindings.Config.key).to(null),
    Binding.bind(SNSBindings.Config.key).to(null),
    Binding.bind(PubnubBindings.Config.key).to(null),
  ];
}
