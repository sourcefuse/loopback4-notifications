import {Constructor} from '@loopback/context';
import {expect, sinon} from '@loopback/testlab';
import {ProviderOptions} from '@parse/node-apn';
import proxyquire from 'proxyquire';
import {ApnsProvider} from '../../providers';
import {ApnsMessage} from '../../providers/push/apns/types';

describe('Apns Service', () => {
  let ApnsMockProvider: Constructor<ApnsProvider>;
  beforeEach(setupMockApns);
  describe('apns configuration addition', () => {
    it('returns error message when no apns config', async () => {
      try {
        /*eslint-disable @typescript-eslint/no-unused-vars*/
        const apnsProvider = new ApnsProvider();
      } catch (err) {
        const result = err.message;
        expect(result).which.eql('Apns Config missing !');
      }
    });
    it('returns error message on passing reciever length as zero', async () => {
      const apnsProvider = new ApnsMockProvider({
        token: {
          key: '.',
          keyId: 'key-id',
          teamId: 'developer-team-id',
        },
        debug: true,
        production: false,
        options: {
          topic: 'dummy topic',
        },
      }).value();

      const message: ApnsMessage = {
        receiver: {
          to: [],
        },
        body: 'test',
        sentDate: new Date(),
        type: 0,
        options: {},
      };
      try {
        const result = apnsProvider.publish(message);
      } catch (err) {
        expect(err.message).which.eql(
          'Message receiver, topic not found in request !',
        );
      }
    });
    it('returns error message on passing reciever length as zero in value function', async () => {
      const apnsProvider = new ApnsMockProvider({
        token: {
          key: '.',
          keyId: 'key-id',
          teamId: 'developer-team-id',
        },
        debug: true,
        production: false,
        options: {
          topic: 'dummy topic',
        },
      }).value();
      const message: ApnsMessage = {
        receiver: {
          to: [],
        },
        body: 'test',
        sentDate: new Date(),
        type: 0,
        options: {},
      };
      try {
        const result = apnsProvider.publish(message);
      } catch (err) {
        expect(err.message).which.eql(
          'Message receiver, topic not found in request !',
        );
      }
    });
    it('returns error message on having no message subject', async () => {
      const apnsProvider = new ApnsMockProvider({
        token: {
          key: '.',
          keyId: 'key-id',
          teamId: 'developer-team-id',
        },
        debug: true,
        production: false,
        options: {
          topic: 'dummy topic',
        },
      });
      const message: ApnsMessage = {
        receiver: {
          to: [
            {
              id: 'dummy',
              type: 0,
            },
          ],
        },
        body: 'test',
        sentDate: new Date(),
        type: 0,
        options: {},
      };
      try {
        const result = apnsProvider.initialValidations(message);
      } catch (err) {
        expect(err.message).which.eql('Message title not found !');
      }
    });

    it('returns error message on having no message subject using value function', async () => {
      const apnsProvider = new ApnsMockProvider({
        token: {
          key: '.',
          keyId: 'key-id',
          teamId: 'developer-team-id',
        },
        debug: true,
        production: false,
        options: {
          topic: 'dummy topic',
        },
      }).value();
      const message: ApnsMessage = {
        receiver: {
          to: [
            {
              id: 'dummy',
              type: 0,
            },
          ],
        },
        body: 'test',
        sentDate: new Date(),
        type: 0,
        options: {},
      };
      try {
        const result = apnsProvider.publish(message);
      } catch (err) {
        expect(err.message).which.eql('Message title not found !');
      }
    });
    it('returns a note object which will sent as a payload', async () => {
      const apnsProvider = new ApnsMockProvider({
        token: {
          key: '.',
          keyId: 'key-id',
          teamId: 'developer-team-id',
        },
        debug: true,
        production: false,
        options: {
          topic: 'dummy topic',
        },
      });
      const message: ApnsMessage = {
        receiver: {
          to: [
            {
              id: 'dummy',
              type: 0,
            },
          ],
        },
        body: 'test',
        sentDate: new Date(),
        type: 0,
        options: {},
        subject: 'test',
      };

      const result = apnsProvider.getMainNote(message);
      expect(result).to.have.Object();
    }).timeout(5000);
  });
  it('returns promise of response', async () => {
    const apnsProvider = new ApnsMockProvider({
      token: {
        key: '.',
        keyId: 'key-id',
        teamId: 'developer-team-id',
      },
      debug: true,
      production: false,
      options: {
        topic: 'dummy topic',
      },
    });
    const message: ApnsMessage = {
      receiver: {
        to: [
          {
            id: 'dummy',
            type: 0,
          },
        ],
      },
      body: 'test',
      sentDate: new Date(),
      type: 0,
      options: {},
      subject: 'test',
    };
    const result = apnsProvider.sendingPushToReceiverTokens(message);
    expect(result).to.have.Promise();
  }).timeout(5000);
  function setupMockApns() {
    const MockApns = sinon.stub();
    MockApns.prototype.apns = sinon.stub().returns(true);
    MockApns.prototype.apns.prototype.Provider = sinon.stub().returns(true);
    /* eslint-disable */
    ApnsMockProvider = proxyquire('../../providers/push/apns/apns.provider', {
      '@parse/node-apn': {
        Provider: function (config: ProviderOptions) {
          return {};
        },
        Notification: function () {
          return {
            expiry: 0,
            badge: 0,
            alert: 'dummy alert',
            payload: {},
            topic: 'dummy topic',
          };
        },
      },
    }).ApnsProvider;
    /* eslint-enable */
  }
});
