import {Binding, Component, ProviderMap} from '@loopback/core';
import {NotificationBindings} from './keys';
import {SESBindings} from './providers/email/ses/keys';
import {NotificationProvider} from './providers/notification.provider';
import {ApnsBinding} from './providers/push/apns/keys';
import {FcmBindings} from './providers/push/fcm/keys';
import {PubnubBindings} from './providers/push/pubnub/keys';
import {SocketBindings} from './providers/push/socketio/keys';
import {SNSBindings} from './providers/sms/sns/keys';

export class NotificationsComponent implements Component {
  constructor() {
    // Intentionally left blank
  }

  providers?: ProviderMap = {
    [NotificationBindings.NotificationProvider.key]: NotificationProvider,
  };

  bindings?: Binding[] = [
    Binding.bind(NotificationBindings.Config.key).to(null),
    Binding.bind(SESBindings.Config.key).to(null),
    Binding.bind(SNSBindings.Config.key).to(null),
    Binding.bind(PubnubBindings.Config.key).to(null),
    Binding.bind(SocketBindings.Config.key).to(null),
    Binding.bind(ApnsBinding.Config.key).to(null),
    Binding.bind(FcmBindings.Config.key).to(null),
  ];
}
