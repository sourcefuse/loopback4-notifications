import * as admin from 'firebase-admin';
import {
  PushMessage,
  PushNotification,
  PushReceiver,
  PushSubscriber,
} from '../types';

export interface FcmNotification extends PushNotification {
  publish(message: FcmMessage): Promise<void>;
}

export interface FcmMessage extends PushMessage {
  /**
   * If the requirement is to send push on topic or condition,
   * send receiver as empty array
   */
  receiver: FcmReceiver;
  options: {
    /**
     * URL of an image to be displayed in the notification.
     */
    imageUrl?: string;
    /**
     * @param dryRun Whether to send the message in the dry-run
     *   (validation only) mode.
     *
     * Whether or not the message should actually be sent. When set to `true`,
     * allows developers to test a request without actually sending a message. When
     * set to `false`, the message will be sent.
     *
     * **Default value:** `false`
     */
    dryRun?: boolean;
    android?: admin.messaging.AndroidConfig;
    webpush?: admin.messaging.WebpushConfig;
    apns?: admin.messaging.ApnsConfig;
    fcmOptions?: admin.messaging.FcmOptions;
    // sonarignore:start
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
    // sonarignore:end
  };
}

export interface FcmReceiver extends PushReceiver {
  to: FcmSubscriber[];
}

export interface FcmSubscriber extends PushSubscriber {
  type: FcmSubscriberType;
  id: string;
}

/**
 * The topic name can be optionally prefixed with "/topics/".
 *
 * the following condition will send messages to devices that are subscribed
 * to TopicA and either TopicB or TopicC
 *
 * "'TopicA' in topics && ('TopicB' in topics || 'TopicC' in topics)"
 *
 *
 * topic?: string;
 *
 * FCM first evaluates any conditions in parentheses, and then evaluates the
 * expression from left to right. In the above expression, a user subscribed
 * to any single topic does not receive the message. Likewise, a user who does
 * not subscribe to TopicA does not receive the message.
 *
 * You can include up to five topics in your conditional expression.
 *
 * example"
 * "'stock-GOOG' in topics || 'industry-tech' in topics"
 *
 * condition?: string;
 */

export const enum FcmSubscriberType {
  RegistrationToken,
  FCMTopic,
  FCMCondition,
}

export interface FcmConfig {
  dbUrl: string;
  serviceAccountPath: string;
}
