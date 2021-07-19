import {expect} from '@loopback/testlab';
import {PubnubConfig, PubNubMessage, PubNubProvider} from '../../providers';
import {Config} from '../../types';

describe('Pubnub Service', () => {
  describe('pubnub configration addition', () => {
    it('returns error message on passing reciever length as zero', async () => {
      const pubnubConfig: PubnubConfig = {
        subscribeKey: 'test',
      };

      const pubnubProvider = new PubNubProvider(pubnubConfig).value();
      const message: PubNubMessage = {
        receiver: {
          to: [],
        },
        body: 'test',
        sentDate: new Date(),
        type: 0,
      };
      const result = await pubnubProvider
        .publish(message)
        .catch(err => err.message);
      expect(result).which.eql('Message receiver not found in request');
    });

    it('returns error message when no pubnub config', async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const pubnubProvider = new PubNubProvider();
      } catch (err) {
        const result = err.message;
        expect(result).which.eql('Pubnub Config missing !');
      }
    });

    it('returns error for grant access', async () => {
      const pubnubConfig: PubnubConfig = {
        subscribeKey: 'test',
      };

      const pubnubProvider = new PubNubProvider(pubnubConfig).value();
      const config: Config = {
        receiver: {
          to: [
            {
              id: 'dummy',
              type: 0,
            },
          ],
        },
        type: 0,
      };
      const result = await pubnubProvider
        .grantAccess(config)
        .catch(err => err.message);
      expect(result).which.eql(
        'Authorization token or ttl not found in request',
      );
    });

    it('returns error for revoke access', async () => {
      const pubnubConfig: PubnubConfig = {
        subscribeKey: 'test',
      };

      const pubnubProvider = new PubNubProvider(pubnubConfig).value();
      const config: Config = {
        receiver: {
          to: [
            {
              id: 'dummy',
              type: 0,
            },
          ],
        },
        type: 0,
      };
      const result = await pubnubProvider
        .revokeAccess(config)
        .catch(err => err.message);
      expect(result).which.eql('Authorization token not found in request');
    });

    it('returns validation failure for revoke access if unable to grant config', async () => {
      const pubnubConfig: PubnubConfig = {
        subscribeKey: 'test',
      };

      const pubnubProvider = new PubNubProvider(pubnubConfig).value();
      const config: Config = {
        receiver: {
          to: [
            {
              id: 'dummy',
              type: 0,
            },
          ],
        },
        type: 0,
        options: {
          ['token']: 'dummy',
        },
      };
      const result = await pubnubProvider
        .revokeAccess(config)
        .catch(err => err.message);
      expect(result).which.eql('Validation failed, check status for details');
    });

    it('returns validation failure for grant access if unable to grant config', async () => {
      const pubnubConfig: PubnubConfig = {
        subscribeKey: 'test',
      };

      const pubnubProvider = new PubNubProvider(pubnubConfig).value();
      const config: Config = {
        receiver: {
          to: [
            {
              id: 'dummy',
              type: 0,
            },
          ],
        },
        type: 0,
        options: {
          ['token']: 'dummy',
          ['ttl']: 'dummy',
        },
      };
      const result = await pubnubProvider
        .grantAccess(config)
        .catch(err => err.message);
      expect(result).which.eql('Validation failed, check status for details');
    });
  });
});
