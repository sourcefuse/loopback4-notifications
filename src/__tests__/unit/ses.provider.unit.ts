import {expect} from '@loopback/testlab';
import {SESMessage, SesProvider} from '../../providers';

describe('Ses Service', () => {
  describe('ses configration addition', () => {
    it('returns error message on having no sender', async () => {
      const Config = {
        sendToMultipleReceivers: false,
      };
      const sesConfig = {
        apiVersion: 'test',
      };

      const sesProvider = new SesProvider(Config, sesConfig).value();
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
      const sesConfig = {
        apiVersion: 'test',
      };

      const sesProvider = new SesProvider(Config, sesConfig).value();
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
      const sesConfig = {
        apiVersion: 'test',
      };

      const sesProvider = new SesProvider(Config, sesConfig).value();
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
        const sesProvider = new SesProvider();
      } catch (err) {
        const result = err.message;
        expect(result).which.eql('AWS SES Config missing !');
      }
    });

    it('returns region missing in configration for single user', async () => {
      const Config = {
        sendToMultipleReceivers: false,
        senderEmail: 'test@gmail.com',
        fromEmail: 'dummy@gmail.com',
      };
      const sesConfig = {
        apiVersion: 'test',
      };

      const sesProvider = new SesProvider(Config, sesConfig).value();
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
      const result = await sesProvider
        .publish(message)
        .catch(err => err.message);
      expect(result).which.eql('Missing region in config');
    }).timeout(1000000);

    it('returns region missing in configration for multiple user', async () => {
      const Config = {
        sendToMultipleReceivers: true,
        senderEmail: 'test@gmail.com',
        fromEmail: 'dummy@gmail.com',
      };
      const sesConfig = {
        apiVersion: 'test',
      };

      const sesProvider = new SesProvider(Config, sesConfig).value();
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
      const result = await sesProvider
        .publish(message)
        .catch(err => err.message);
      expect(result).which.eql('Missing region in config');
    }).timeout(1000000);
  });
});
