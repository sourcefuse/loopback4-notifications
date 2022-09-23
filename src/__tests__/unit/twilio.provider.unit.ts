import {Constructor} from '@loopback/core';
import {expect, sinon} from '@loopback/testlab';
import proxyquire from 'proxyquire';
import {TwilioMessage, TwilioProvider} from '../../providers';

describe('Twilio Service', () => {
  const message: TwilioMessage = {
    receiver: {
      to: [],
    },
    body: 'test',
    sentDate: new Date(),
    type: 0,
    subject: undefined,
  };
  const messageText: TwilioMessage = {
    receiver: {
      to: [
        {
          id: 'XXXXXXXXXXX',
          type: 1,
        },
      ],
    },
    body: 'Test SMS Text Notification',
    sentDate: new Date(),
    type: 2,
    subject: undefined,
  };
  const messageTextMedia: TwilioMessage = {
    receiver: {
      to: [
        {
          id: 'XXXXXXXXXXX',
          type: 1,
        },
      ],
    },
    body: 'Test SMS Notification with media',
    mediaUrl: ['https://demo.twilio.com/owl.png'],
    sentDate: new Date(),
    type: 2,
    subject: undefined,
  };
  const messageWhatsApp: TwilioMessage = {
    receiver: {
      to: [
        {
          id: 'XXXXXXXXXXX',
          type: 0,
        },
      ],
    },
    body: 'Test Whatsapp Notification',
    sentDate: new Date(),
    type: 2,
    subject: undefined,
  };
  const messageWAMedia: TwilioMessage = {
    receiver: {
      to: [
        {
          id: 'XXXXXXXXXXX',
          type: 0,
        },
      ],
    },
    body: 'Test Whatsapp message with media',
    mediaUrl: ['https://demo.twilio.com/owl.png'],
    sentDate: new Date(),
    type: 2,
    subject: undefined,
  };
  const configration = {
    accountSid: 'ACTSIDDUMMY',
    authToken: 'AUTHDUMMY',
    waFrom: '', //Ex. whatsapp:+XXXXXXXXXXX
    smsFrom: '',
    opts: {dummy: true}, //Change dummy value to false when using unit test
  };

  let TwilioProviderMock: Constructor<TwilioProvider>;
  beforeEach(setupMockTwilio);
  describe('twilio configration addition', () => {
    it('returns error message on passing reciever length as zero', async () => {
      const twilioProvider = new TwilioProviderMock(configration).value();
      const result = await twilioProvider
        .publish(message)
        .catch(err => err.message);
      expect(result).which.eql('Message receiver not found in request');
    });

    it('returns error message when no twilio config', async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const twilioProvider = new TwilioProvider();
      } catch (err) {
        const result = err.message;
        expect(result).which.eql('Twilio Config missing !');
      }
    });

    it('returns the message (SMS text)', async () => {
      const twilioProvider = new TwilioProviderMock(configration).value();
      const result = twilioProvider.publish(messageText);
      if (configration.opts?.dummy) {
        expect(result).to.have.Promise();
      } else {
        await expect(result).to.be.fulfilled();
      }
    });

    it('returns the message (SMS with media)', async () => {
      const twilioProvider = new TwilioProviderMock(configration).value();
      const result = twilioProvider.publish(messageTextMedia);
      if (configration.opts?.dummy) {
        expect(result).to.have.Promise();
      } else {
        await expect(result).to.be.fulfilled();
      }
    });

    it('returns the message (Whatsapp)', async () => {
      const twilioProvider = new TwilioProviderMock(configration).value();
      const result = twilioProvider.publish(messageWhatsApp);
      if (configration.opts?.dummy) {
        expect(result).to.have.Promise();
      } else {
        await expect(result).to.be.fulfilled();
      }
    });

    it('returns the message (Whatsapp with Media)', async () => {
      const twilioProvider = new TwilioProviderMock(configration).value();
      const result = twilioProvider.publish(messageWAMedia);
      if (configration.opts?.dummy) {
        expect(result).to.have.Promise();
      } else {
        await expect(result).to.be.fulfilled();
      }
    });
  });

  function setupMockTwilio() {
    const mockTwilio = sinon.stub();
    mockTwilio.prototype.publish = sinon.stub().returns(Promise.resolve());
    TwilioProviderMock = proxyquire(
      '../../providers/sms/twilio/twilio.provider',
      {
        'twilio.twilio': mockTwilio,
      },
    ).TwilioProvider;
  }
});
