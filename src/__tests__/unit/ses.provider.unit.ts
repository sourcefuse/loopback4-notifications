/* eslint-disable @typescript-eslint/no-misused-promises */
import {Constructor} from '@loopback/core';
import {expect, sinon} from '@loopback/testlab';
import proxyquire from 'proxyquire';
import {SESMessage, SesProvider} from '../../providers';

describe('Ses Service', () => {
  let SesMockProvider: Constructor<SesProvider>;
  beforeEach(setUpMockSES);
  describe('ses configration addition', () => {
    const sesConfig = {
      accessKeyId: '',
      secretAccessKey: '',
      region: 'us-east-1',
    };

    it('returns error message on having no sender', async () => {
      const Config = {
        sendToMultipleReceivers: false,
      };
      const sesProvider = new SesMockProvider(Config, sesConfig).value();

      const message: SESMessage = {
        receiver: {
          to: [],
        },
        body: 'test',
        sentDate: new Date(),
        type: 0,
      };
      const result = await sesProvider
        .publish(message)
        .catch(err => err.message);
      expect(result).which.eql('Message sender not found in request');
    });

    it('returns error message on passing reciever length as zero', async () => {
      const Config = {
        sendToMultipleReceivers: false,
        senderEmail: 'test@test.com',
      };

      const sesProvider = new SesMockProvider(Config, sesConfig).value();
      const message: SESMessage = {
        receiver: {
          to: [],
        },
        body: 'test',
        sentDate: new Date(),
        type: 0,
      };
      const result = await sesProvider
        .publish(message)
        .catch(err => err.message);
      expect(result).which.eql('Message receiver not found in request');
    });

    it('returns error message when message is not complete', async () => {
      const Config = {
        sendToMultipleReceivers: false,
        senderEmail: 'test@test.com',
      };

      const sesProvider = new SesMockProvider(Config, sesConfig).value();
      const message: SESMessage = {
        receiver: {
          to: [
            {
              id: 'dummy',
            },
          ],
        },
        body: 'test',
        sentDate: new Date(),
        type: 0,
      };
      const result = await sesProvider
        .publish(message)
        .catch(err => err.message);
      expect(result).which.eql('Message data incomplete');
    });

    it('returns error message when no ses config', async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const sesProvider = new SesMockProvider();
      } catch (err) {
        const result = err.message;
        expect(result).which.eql('AWS SES Config missing !');
      }
    });

    it('returns a Promise after sending message to individual user', async () => {
      const Config = {
        sendToMultipleReceivers: false,
        senderEmail: 'test@gmail.com',
      };

      const sesProvider = new SesMockProvider(Config, sesConfig).value();
      const message: SESMessage = {
        receiver: {
          to: [
            {
              id: 'dummy',
            },
          ],
        },
        body: 'test',
        sentDate: new Date(),
        type: 0,
        subject: 'test',
      };
      const result = sesProvider.publish(message);
      await expect(result).to.be.fulfilled();
    });

    it('returns a Promise after sending message to multiple user', async () => {
      const Config = {
        sendToMultipleReceivers: true,
        senderEmail: 'test@gmail.com',
      };
      const sesProvider = new SesMockProvider(Config, sesConfig).value();
      const message: SESMessage = {
        receiver: {
          to: [
            {
              id: 'dummy',
            },
          ],
        },
        body: 'test',
        sentDate: new Date(),
        type: 0,
        subject: 'test',
      };
      const result = sesProvider.publish(message);
      await expect(result).to.be.fulfilled();
    });
  });

  function setUpMockSES() {
    const mockSES = sinon.stub();
    mockSES.prototype.sendEmail = sinon
      .stub()
      .returns({promise: () => Promise.resolve()});
    SesMockProvider = proxyquire('../../providers/email/ses/ses.provider', {
      'aws-sdk': {
        SES: mockSES,
      },
    }).SesProvider;
  }
});
