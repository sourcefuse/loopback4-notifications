import {inject, Provider} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {NotificationError} from '../error-keys';
import {NotificationBindings} from '../keys';
import {INotification, Message, MessageType} from '../types';

export class NotificationProvider implements Provider<INotification> {
  constructor(
    @inject(NotificationBindings.SMSProvider, {optional: true})
    private readonly smsProvider?: INotification,
    @inject(NotificationBindings.EmailProvider, {optional: true})
    private readonly emailProvider?: INotification,
    @inject(NotificationBindings.PushProvider, {optional: true})
    private readonly pushProvider?: INotification,
  ) {}

  publish(data: Message) {
    if (data.type === MessageType.SMS && this.smsProvider) {
      return this.smsProvider.publish(data);
    } else if (data.type === MessageType.Email && this.emailProvider) {
      return this.emailProvider.publish(data);
    } else if (data.type === MessageType.Push && this.pushProvider) {
      return this.pushProvider.publish(data);
    } else {
      throw new HttpErrors.UnprocessableEntity(
        NotificationError.ProviderNotFound,
      );
    }
  }

  value() {
    return {
      publish: async (message: Message) => this.publish(message),
    };
  }
}
