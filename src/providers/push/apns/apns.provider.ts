import {inject, Provider} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import apns from '@parse/node-apn';
import {ApnsBinding} from './keys';
import {ApnsConfigType, ApnsMessage, ApnsSubscriberType} from './types';
// sonarignore:start
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ApnsProvider implements Provider<any> {
  // sonarignore:end
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

    if (message.receiver.to.length > 500) {
      throw new HttpErrors.BadRequest(
        'Message receiver count cannot exceed 500 !',
      );
    }
    if (!message.subject) {
      throw new HttpErrors.BadRequest('Message title not found !');
    }
  }
  getMainNote(message: ApnsMessage) {
    const note = new apns.Notification();
    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    note.badge = this.apnsConfig?.options.badge ?? 3;
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
