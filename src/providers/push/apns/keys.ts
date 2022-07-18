import {BindingKey} from '@loopback/core';
import * as apns from '@parse/node-apn';

export namespace ApnsBinding {
  // sonarignore:start
  export const Config = BindingKey.create<apns.Provider | null>(
    'sf.notification.config.apns',
  );
  // sonarignore:end
}
