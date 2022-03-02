/* eslint-disable @typescript-eslint/no-misused-promises */
import {Constructor} from '@loopback/core';
import {expect, sinon} from '@loopback/testlab';
import proxyquire from 'proxyquire';
import {SNSMessage, SnsProvider} from '../../providers';

describe('Sns Service', () => {
  const message: SNSMessage = {
    receiver: {
      to: [],
    },
    body: 'test',
    sentDate: new Date(),
    type: 0,
    subject: undefined,
  };
  const message1: SNSMessage = {
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
    subject: undefined,
  };
  const configration = {
    apiVersion: 'test',
    accessKeyId: '',
    secretAccessKey: '',
    region: 'us-east-1',
  };

  let SnsProviderMock: Constructor<SnsProvider>;
  beforeEach(setupMockSNS);
  describe('sns configration addition', () => {
    it('returns error message on passing reciever length as zero', async () => {
      const snsProvider = new SnsProviderMock(configration).value();
      const result = await snsProvider
        .publish(message)
        .catch(err => err.message);
      expect(result).which.eql('Message receiver not found in request');
    });

    it('returns error message when no sns config', async () => {
      try {
        /* eslint-disable @typescript-eslint/no-unused-vars */
        const snsProvider = new SnsProvider();
      } catch (err) {
        const result = err.message;
        expect(result).which.eql('AWS SNS Config missing !');
      }
    });

    it('returns the message', async () => {
      const snsProvider = new SnsProviderMock(configration).value();
      const result = snsProvider.publish(message1);
      await expect(result).to.be.fulfilled();
    });
  });

  function setupMockSNS() {
    const mockSNS = sinon.stub();
    mockSNS.prototype.publish = sinon
      .stub()
      .returns({promise: () => Promise.resolve()});
    SnsProviderMock = proxyquire('../../providers/sms/sns/sns.provider', {
      'aws-sdk': {
        SNS: mockSNS,
      },
    }).SnsProvider;
  }
});
