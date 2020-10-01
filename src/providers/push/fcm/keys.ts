import {BindingKey} from '@loopback/core';
import {FcmConfig} from './types';

export namespace FcmBindings {
  export const Config = BindingKey.create<FcmConfig | null>(
    'sf.notification.config.fcm',
  );
}
