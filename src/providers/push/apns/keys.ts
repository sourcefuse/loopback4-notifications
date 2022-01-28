import {BindingKey} from '@loopback/core';
export namespace ApnsBinding {
  // sonarignore:start
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const Config = BindingKey.create<any | null>(
    'sf.notification.config.apns',
  );
  // sonarignore:end
}
