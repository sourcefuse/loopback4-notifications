/* eslint-disable @typescript-eslint/no-shadow */
import {Constructor} from '@loopback/context';
import {expect, sinon} from '@loopback/testlab';
import proxyquire from 'proxyquire';
import {ApnsProvider} from '../../providers';
import {ApnsMessage} from '../../providers/push/apns/types';

describe('Apns Service', () => {
  let ApnsMockProvider: Constructor<ApnsProvider>;
  beforeEach(SetupMockApns);
  const apnsProvider = new ApnsProvider({
    providerOptions: {
      token: {
        key: './',
        keyId: 'key-id',
        teamId: 'developer-team-id',
      },
      production: false,
    },
    options: {
      badge: 1,
      topic: 'test topic',
    },
  });
  describe('apns configuration addition', () => {
    it('returns error message when no apns config', async () => {
      try {
        /* eslint-disable @typescript-eslint/no-unused-vars */
        // const apnsProvider = new ApnsProvider();
        const apnsProvider = new ApnsMockProvider();
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
        const result = apnsProvider.value().publish(message);
      } catch (err) {
        expect(err.message).which.eql(
          'Message receiver, topic not found in request !',
        );
      }
    });
    it('returns error message on having no message subject', async () => {
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
        const result = apnsProvider.value().publish(message);
      } catch (err) {
        expect(err.message).which.eql('Message title not found !');
      }
    });
    it('returns a note object which will sent as a payload', async () => {
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
  // eslint-disable-next-line @typescript-eslint/naming-convention
  function SetupMockApns() {
    const MockApns = sinon.stub();

    MockApns.prototype.apns = sinon.stub().returns(true);
    // MockApns.prototype.apnsService = sinon.stub().returns({});

    MockApns.prototype.apns.prototype.Provider = sinon.stub().returns(true);
    //MockApns.prototype.send = sinon

    //   .stub()
    //   .returns({sent: [{device: 'string'}]});
    ApnsMockProvider = proxyquire('../../providers/push/apns/apns.provider', {
      'node-apns': {apns: MockApns},
    }).ApnsProvider;
  }
});
