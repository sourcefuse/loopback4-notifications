import {expect} from '@loopback/testlab';
import {NodemailerMessage, NodemailerProvider} from '../../providers';

describe('Nodemailer Service', () => {
  describe('nodemailer configration addition', () => {
    it('returns error message on having no sender', async () => {
      const nodeConfig = {
        sendToMultipleReceivers: false,
      };
      const nodemailerConfig = {
        service: 'test',
        url: 'test url',
      };

      const nodemailerProvider = new NodemailerProvider(
        nodeConfig,
        nodemailerConfig,
      ).value();
      const message: NodemailerMessage = {
        receiver: {
          to: [],
        },
        body: 'test',
        sentDate: new Date(),
        type: 0,
      };
      const result = await nodemailerProvider
        .publish(message)
        .catch(err => err.message);
      expect(result).which.eql('Message sender not found in request');
    });

    it('returns error message on passing reciever length as zero', async () => {
      const nodeConfig = {
        sendToMultipleReceivers: false,
        senderEmail: 'test@test.com',
      };
      const nodemailerConfig = {
        service: 'test',
        url: 'test url',
      };

      const nodemailerProvider = new NodemailerProvider(
        nodeConfig,
        nodemailerConfig,
      ).value();
      const message: NodemailerMessage = {
        receiver: {
          to: [],
        },
        body: 'test',
        sentDate: new Date(),
        type: 0,
      };
      const result = await nodemailerProvider
        .publish(message)
        .catch(err => err.message);
      expect(result).which.eql('Message receiver not found in request');
    });

    it('returns error message when message is not complete', async () => {
      const nodeConfig = {
        sendToMultipleReceivers: false,
        senderEmail: 'test@test.com',
      };
      const nodemailerConfig = {
        service: 'test',
        url: 'test url',
      };

      const nodemailerProvider = new NodemailerProvider(
        nodeConfig,
        nodemailerConfig,
      ).value();
      const message: NodemailerMessage = {
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
      const result = await nodemailerProvider
        .publish(message)
        .catch(err => err.message);
      expect(result).which.eql('Message data incomplete');
    });

    it('returns registration or blockage for incorrect details for single user', async () => {
      const nodeConfig = {
        sendToMultipleReceivers: false,
        senderEmail: 'test@test.com',
      };
      const nodemailerConfig = {
        service: 'test',
        url: 'test url',
      };

      const nodemailerProvider = new NodemailerProvider(
        nodeConfig,
        nodemailerConfig,
      ).value();
      const message: NodemailerMessage = {
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
      const result = await nodemailerProvider
        .publish(message)
        .catch(err => err.message);
      expect(result).which.eql('connect ECONNREFUSED 127.0.0.1:587');
    });

    it('returns registration or blockage for incorrect details for multiple user', async () => {
      const nodeConfig = {
        sendToMultipleReceivers: true,
        senderEmail: 'test@test.com',
      };
      const nodemailerConfig = {
        service: 'test',
        url: 'test url',
      };

      const nodemailerProvider = new NodemailerProvider(
        nodeConfig,
        nodemailerConfig,
      ).value();
      const message: NodemailerMessage = {
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
      const result = await nodemailerProvider
        .publish(message)
        .catch(err => err.message);
      expect(result).which.eql('connect ECONNREFUSED 127.0.0.1:587');
    });
  });
});
