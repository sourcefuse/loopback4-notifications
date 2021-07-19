/* eslint-disable @typescript-eslint/no-unused-vars */
import {expect} from '@loopback/testlab';
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
  };

  const snsProvider = new SnsProvider(configration).value();

  describe('sns configration addition', () => {
    it('returns error message on passing reciever length as zero', async () => {
      const result = await snsProvider
        .publish(message)
        .catch(err => err.message);
      expect(result).which.eql('Message receiver not found in request');
    });

    it('returns error message when no sns config', async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const snsProvider = new SnsProvider();
      } catch (err) {
        const result = err.message;
        expect(result).which.eql('AWS SNS Config missing !');
      }
    });

    it('returns the message', async () => {
      const result = await snsProvider
        .publish(message1)
        .catch(err => err.message);
      expect(result).which.eql('Missing region in config');
    }).timeout(1000000);
  });
});
