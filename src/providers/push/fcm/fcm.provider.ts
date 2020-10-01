import {inject, Provider} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import * as admin from 'firebase-admin';
import {FcmBindings} from './keys';
import {
  FcmConfig,
  FcmMessage,
  FcmNotification,
  FcmSubscriberType,
} from './types';

export class FcmProvider implements Provider<FcmNotification> {
  constructor(
    @inject(FcmBindings.Config, {
      optional: true,
    })
    private readonly fcmConfig?: FcmConfig,
  ) {
    if (this.fcmConfig) {
      this.fcmService = admin.initializeApp({
        credential: admin.credential.cert(this.fcmConfig.serviceAccountPath),
        databaseURL: this.fcmConfig.dbUrl,
      });
    } else {
      throw new HttpErrors.PreconditionFailed('Firebase Config missing !');
    }
  }

  fcmService: admin.app.App;

  initialValidations(message: FcmMessage) {
    if (
      message.receiver.to.length === 0 &&
      !message.options.topic &&
      !message.options.condition
    ) {
      throw new HttpErrors.BadRequest(
        'Message receiver, topic or condition not found in request !',
      );
    }

    if (message.receiver.to.length > 500) {
      throw new HttpErrors.BadRequest(
        'Message receiver count cannot exceed 500 !',
      );
    }

    if (!message.subject) {
      throw new HttpErrors.BadRequest('Message title not found !');
    }
  }

  sendingPushToReceiverTokens(
    message: FcmMessage,
    generalMessageObj: {
      notification: admin.messaging.Notification;
      android?: admin.messaging.AndroidConfig;
      webpush?: admin.messaging.WebpushConfig;
      apns?: admin.messaging.ApnsConfig;
      fcmOptions?: admin.messaging.FcmOptions;
    },
  ) {
    const promises: Promise<string | admin.messaging.BatchResponse>[] = [];
    /**Partial<admin.messaging.MulticastMessage>
     * These are the registration tokens for all devices which this message
     * is intended for.
     *
     * If receiver does not hold information for type, then it is considered
     * as devce token.
     */
    const receiverTokens = message.receiver.to.filter(
      item => item.type === FcmSubscriberType.RegistrationToken || !item.type,
    );

    /**
     * if the receivers are of type
     * */
    if (receiverTokens.length >= 1) {
      const tokens = receiverTokens.map(item => item.id);
      const msgToTransfer = {
        tokens: tokens,
        ...generalMessageObj,
        data: {...message.options.data},
      };
      promises.push(
        this.fcmService
          .messaging()
          .sendMulticast(msgToTransfer, (message.options.dryRun = false)),
      );
    }
    return promises;
  }

  sendingPushToTopics(
    message: FcmMessage,
    generalMessageObj: {
      notification: admin.messaging.Notification;
      android?: admin.messaging.AndroidConfig;
      webpush?: admin.messaging.WebpushConfig;
      apns?: admin.messaging.ApnsConfig;
      fcmOptions?: admin.messaging.FcmOptions;
    },
  ) {
    const promises: Promise<string | admin.messaging.BatchResponse>[] = [];
    const topics = message.receiver.to.filter(
      item => item.type === FcmSubscriberType.FCMTopic,
    );

    if (topics.length > 0) {
      // Messages to multiple Topics is not allowed in single transaction.

      topics.forEach(topic => {
        const msgToTransfer = {
          topic: topic.id,
          ...generalMessageObj,
          data: {...message.options.data},
        };

        promises.push(
          this.fcmService
            .messaging()
            .send(msgToTransfer, (message.options.dryRun = false)),
        );
      });
    }

    return promises;
  }

  sendingPushToConditions(
    message: FcmMessage,
    generalMessageObj: {
      notification: admin.messaging.Notification;
      android?: admin.messaging.AndroidConfig;
      webpush?: admin.messaging.WebpushConfig;
      apns?: admin.messaging.ApnsConfig;
      fcmOptions?: admin.messaging.FcmOptions;
    },
  ) {
    const promises: Promise<string | admin.messaging.BatchResponse>[] = [];
    const conditions = message.receiver.to.filter(
      item => item.type === FcmSubscriberType.FCMCondition,
    );

    if (conditions.length > 0) {
      // Condition message

      conditions.forEach(condition => {
        const msgToTransfer = {
          condition: condition.id,
          ...generalMessageObj,
          data: {...message.options.data},
        };
        promises.push(
          this.fcmService
            .messaging()
            .send(msgToTransfer, (message.options.dryRun = false)),
        );
      });
    }

    return promises;
  }

  value() {
    return {
      publish: async (message: FcmMessage) => {
        /**
         * validating the initial request
         */
        this.initialValidations(message);

        /**
         * This method is responsible to send all the required data to mobile application
         * The mobile device will recieve push notification.
         * Push will be sent to the devices with registration token sent in receiver
         * Notification object holds title, body and imageUrl
         * FCM message must contain 2 attributes, i.e title and body
         *
         */

        const promises: Promise<string | admin.messaging.BatchResponse>[] = [];

        const standardNotifForFCM: admin.messaging.Notification = {
          body: message.body,
          title: message.subject,
          imageUrl: message.options.imageUrl,
        };

        /**
         * Message attributes for all kinds of messages
         *
         * If android configurations are sent in options, it will take the
         * precedence over normal notification
         *
         */
        const generalMessageObj = {
          notification: standardNotifForFCM,
          android: message.options.android,
          webpush: message.options.webpush,
          apns: message.options.apns,
          fcmOptions: message.options.fcmOptions,
        };

        /**
         * Sending messages for all the tokens in the request
         */
        promises.push(
          ...this.sendingPushToReceiverTokens(message, generalMessageObj),
        );

        /**
         * Sending messages for all the topics in the request
         */
        promises.push(...this.sendingPushToTopics(message, generalMessageObj));

        /**
         * Sending messages for all the conditions in the request
         */
        promises.push(
          ...this.sendingPushToConditions(message, generalMessageObj),
        );

        await Promise.all(promises);
      },
    };
  }
}
