import {inject, Provider} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import Pubnub from 'pubnub';
import {Aps, MessageConfig, PnApns, TargetsType} from '.';
import {Config} from '../../../types';
import {PubnubBindings} from './keys';
import {
  PayloadType,
  PubNubMessage,
  PubNubNotification,
  PubNubSubscriberType,
} from './types';

export class PubNubProvider implements Provider<PubNubNotification> {
  constructor(
    @inject(PubnubBindings.Config, {
      optional: true,
    })
    private readonly pnConfig?: Pubnub.PubnubConfig,
  ) {
    if (this.pnConfig) {
      this.pubnubService = new Pubnub(this.pnConfig);
    } else {
      throw new HttpErrors.PreconditionFailed('Pubnub Config missing !');
    }
  }

  pubnubService: Pubnub;
  getGeneralMessageObject(message: PubNubMessage) {
    const commonDataNotification: MessageConfig = Object.assign(
      {
        title: message.subject,
        description: message.body,
      },
      message.options,
    );

    const pnGcm =
      message.options?.payloadType === PayloadType.Data
        ? {data: commonDataNotification}
        : {notification: commonDataNotification};

    const apsData: Aps = {
      alert: commonDataNotification,
      key: message.subject,
      sound: message?.options?.sound ? message.options.sound : 'default',
    };
    const targetTypeData: TargetsType[] = [
      {
        targets: [
          {
            environment: process.env.PUBNUB_APNS2_ENV,
            topic: process.env.PUBNUB_APNS2_BUNDLE_ID,
          },
        ],
        version: 'v2',
      },
    ];
    const pnApns: PnApns = {
      aps: apsData,
      pnPush: targetTypeData,
    };
    return {pnGcm: pnGcm, pnApns: Object.assign(pnApns, message.options)};
  }
  getPublishConfig(message: PubNubMessage) {
    const generalMessageObj = this.getGeneralMessageObject(message);
    const publishConfig: Pubnub.PublishParameters = {
      channel: '',
      message: {
        title: message.subject,
        description: message.body,
        ...generalMessageObj,
      },
    };
    return publishConfig;
  }

  value() {
    return {
      publish: async (message: PubNubMessage) => {
        if (message.receiver.to.length === 0) {
          throw new HttpErrors.BadRequest(
            'Message receiver not found in request',
          );
        }
        const publishConfig = this.getPublishConfig(message);
        const publishes = message.receiver.to.map(receiver => {
          if (receiver.type === PubNubSubscriberType.Channel) {
            publishConfig.channel = receiver.id;
          }

          return this.pubnubService.publish(publishConfig);
        });

        await Promise.all(publishes);
      },
      grantAccess: async (config: Config) => {
        if (config.options?.token && config.options.ttl) {
          const publishConfig: Pubnub.GrantParameters = {
            authKeys: [config.options.token],
            channels: config.receiver.to.map(receiver => receiver.id),
            read: config.options.allowRead || true,
            write: config.options.allowWrite || false,
            ttl: config.options.ttl,
          };
          await this.pubnubService.grant(publishConfig);
          return {
            ttl: config.options.ttl,
          };
        }
        throw new HttpErrors.BadRequest(
          'Authorization token or ttl not found in request',
        );
      },
      revokeAccess: async (config: Config) => {
        if (config.options?.token) {
          const publishConfig: Pubnub.GrantParameters = {
            channels: config.receiver.to.map(receiver => receiver.id),
            authKeys: [config.options.token],
            read: false,
            write: false,
          };
          await this.pubnubService.grant(publishConfig);
          return {
            success: true,
          };
        }
        throw new HttpErrors.BadRequest(
          'Authorization token not found in request',
        );
      },
    };
  }
}
