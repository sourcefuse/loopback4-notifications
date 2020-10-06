import {BindingKey} from '@loopback/core';
import * as admin from 'firebase-admin';

export namespace FcmBindings {
  export const Config = BindingKey.create<admin.app.App | null>(
    'sf.notification.config.fcm',
  );
}
