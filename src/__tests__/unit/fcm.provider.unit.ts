/* eslint-disable @typescript-eslint/no-shadow */
import {expect} from '@loopback/testlab';
import * as admin from 'firebase-admin';
import {FcmMessage, FcmProvider} from '../../providers';

describe('FCM Service', () => {
  const app = admin.initializeApp();
  const fcmProvider = new FcmProvider(app);

  describe('fcm configration addition', () => {
    it('returns error message when no firebase config', () => {
      try {
        /* eslint-disable @typescript-eslint/no-unused-vars */
        const fcmProvider = new FcmProvider();
      } catch (err) {
        const result = err.message;
        expect(result).which.eql('Firebase Config missing !');
      }
    });

    it('returns error message on passing reciever length as zero', () => {
      const message: FcmMessage = {
        receiver: {
          to: [],
        },
        body: 'test',
        sentDate: new Date(),
        type: 0,
        options: {},
      };
      try {
        const result = fcmProvider.initialValidations(message);
      } catch (err) {
        expect(err.message).which.eql(
          'Message receiver, topic or condition not found in request !',
        );
      }
    });

    it('returns error message on passing reciever length as zero in value function', () => {
      const message: FcmMessage = {
        receiver: {
          to: [],
        },
        body: 'test',
        sentDate: new Date(),
        type: 0,
        options: {},
      };
      try {
        const result = fcmProvider.value().publish(message);
      } catch (err) {
        expect(err.message).which.eql(
          'Message receiver, topic or condition not found in request !',
        );
      }
    });

    it('returns error message on having no message subject', () => {
      const message: FcmMessage = {
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
        const result = fcmProvider.initialValidations(message);
      } catch (err) {
        expect(err.message).which.eql('Message title not found !');
      }
    });

    it('returns error message on having no message subject using value function', () => {
      const message: FcmMessage = {
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
        const result = fcmProvider.value().publish(message);
      } catch (err) {
        expect(err.message).which.eql('Message title not found !');
      }
    });

    it('returns array for sending push to conditions', () => {
      const message: FcmMessage = {
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

      const generalMessageObj = {
        notification: {
          title: 'test',
          body: 'test',
        },
      };
      const result = fcmProvider.sendingPushToConditions(
        message,
        generalMessageObj,
      );
      expect(result).which.eql([]);
    }).timeout(5000);

    it('returns array for sending push to receive tokens', () => {
      const message: FcmMessage = {
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

      const generalMessageObj = {
        notification: {
          title: 'test',
          body: 'test',
        },
      };
      const result = fcmProvider.sendingPushToReceiverTokens(
        message,
        generalMessageObj,
      );
      expect(result).to.have.Array();
    }).timeout(5000);

    it('returns array for sending push to topics', () => {
      const message: FcmMessage = {
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

      const generalMessageObj = {
        notification: {
          title: 'test',
          body: 'test',
        },
      };
      const result = fcmProvider.sendingPushToTopics(
        message,
        generalMessageObj,
      );
      expect(result).which.eql([]);
    }).timeout(5000);

    it('returns array for sending in value function', () => {
      const message: FcmMessage = {
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
      const result = fcmProvider.value().publish(message);
      expect(result).to.have.Promise();
    }).timeout(5000);
  });
});
