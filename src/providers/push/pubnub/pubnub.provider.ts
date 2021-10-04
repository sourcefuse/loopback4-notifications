import {inject, Provider} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {Config} from '../../../types';
import Pubnub from '../../../types/pubnub';
import {loadDynamic} from '../../dynamic-loader';
import {PubnubBindings} from './keys';
import {PubNubMessage, PubNubNotification, PubNubSubscriberType} from './types';

export class PubNubProvider implements Provider<PubNubNotification> {
  constructor(
    @inject(PubnubBindings.Config, {
      optional: true,
    })
    private readonly pnConfig?: Pubnub.PubnubConfig,
  ) {}

  pubnubService: Pubnub;

  async value() {
    const pubnub = await loadDynamic('pubnub');
    const errorMessage =
      'Cannot use PubNub service!' +
      '\n' +
      'Please install pubnub before using this service.' +
      '\n' +
      'Run `npm install --save pubnub` to install AWS SDK.';

    if (!pubnub) {
      console.error(errorMessage);
      return {
        publish: async (message: PubNubMessage) => {
          console.error(errorMessage);
          throw new HttpErrors.ServiceUnavailable('PubNub service unavailable');
        },
        grantAccess: async (config: Config) => {
          return {};
        },
        revokeAccess: async (config: Config) => {
          return {};
        },
      };
    } else {
      this.pubnubService = new pubnub(this.pnConfig);
    }

    return {
      publish: async (message: PubNubMessage) => {
        if (message.receiver.to.length === 0) {
          throw new HttpErrors.BadRequest(
            'Message receiver not found in request',
          );
        }
        const publishes = message.receiver.to.map(receiver => {
          const publishConfig: Pubnub.PublishParameters = {
            channel: '',
            message: {
              title: message.subject,
              description: message.body,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              pn_gcm: {
                data: Object.assign(
                  {
                    title: message.subject,
                    description: message.body,
                  },
                  message.options,
                ),
              },
              // eslint-disable-next-line @typescript-eslint/naming-convention
              pn_apns: Object.assign(
                {
                  aps: {
                    alert: message.body,
                    key: message.subject,
                    sound: message?.options?.sound
                      ? message.options.sound
                      : 'default',
                  },
                  // eslint-disable-next-line @typescript-eslint/naming-convention
                  pn_push: [
                    {
                      targets: [
                        {
                          environment: process.env.PUBNUB_APNS2_ENV,
                          topic: process.env.PUBNUB_APNS2_BUNDLE_ID,
                        },
                      ],
                      version: 'v2',
                    },
                  ],
                },
                message.options,
              ),
            },
          };
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
