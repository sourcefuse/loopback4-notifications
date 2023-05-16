import {inject, Provider} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import apns from '@parse/node-apn';
import {ApnsBinding} from './keys';
import {ApnsConfigType, ApnsMessage, ApnsSubscriberType} from './types';

export class ApnsProvider implements Provider<AnyObject> {
  constructor(
    @inject(ApnsBinding.Config, {
      optional: true,
    })
    private readonly apnsConfig?: ApnsConfigType,
  ) {
    if (this.apnsConfig) {
      try {
        if (!this.apnsConfig.options.topic) {
          throw new HttpErrors.PreconditionFailed('Topic missing !');
        }
        this.apnsService = new apns.Provider(this.apnsConfig.providerOptions);
      } catch (err) {
        throw new HttpErrors.PreconditionFailed(err);
      }
    } else {
      throw new HttpErrors.PreconditionFailed('Apns Config missing !');
    }
  }
  apnsService: apns.Provider;
  initialValidations(message: ApnsMessage) {
    if (!!message.options.messageFrom) {
      throw new HttpErrors.BadRequest('Message From not found in request !');
    }
    if (!message.receiver.to.length) {
      throw new HttpErrors.BadRequest(
        'Message receiver not found in request !',
      );
    }

    const maxReceivers = 500;
    if (message.receiver.to.length > maxReceivers) {
      throw new HttpErrors.BadRequest(
        'Message receiver count cannot exceed 500 !',
      );
    }
    if (!message.subject) {
      throw new HttpErrors.BadRequest('Message title not found !');
    }
  }
  getMainNote(message: ApnsMessage) {
    const expiresIn = 3600; // seconds
    const floor = 1000;
    const defaultBadgeCount = 3;
    const note = new apns.Notification();
    note.expiry = Math.floor(Date.now() / floor) + expiresIn; // Expires 1 hour from now.
    note.badge = this.apnsConfig?.options.badge ?? defaultBadgeCount;
    note.alert = message.body;
    note.payload = {messageFrom: message.options.messageFrom};
    // The topic is usually the bundle identifier of your application.
    note.topic = String(this.apnsConfig?.options.topic);
    return note;
  }
  async sendingPushToReceiverTokens(message: ApnsMessage): Promise<void> {
    const receiverTokens = message.receiver.to.filter(
      item => item.type === ApnsSubscriberType.RegistrationToken || !item.type,
    );
    if (receiverTokens.length >= 1) {
      const tokens = receiverTokens.map(item => item.id);
      await this.apnsService.send(this.getMainNote(message), tokens);
    }
  }
  value() {
    return {
      publish: async (message: ApnsMessage) => {
        this.initialValidations(message);
        await this.sendingPushToReceiverTokens(message);
      },
    };
  }
}
