# loopback4-notifications

[![LoopBack](<https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)

This is a loopback-next extension for adding different notification mechanisms vis-à-vis, Push, SMS, Email, to any loopback 4 based REST API application or microservice.

It provides a generic provider-based framework to add your own implementation or implement any external service provider to achieve the same. There are 3 different providers available to be injected namely, PushProvider, SMSProvider and EmailProvider. It also provides support for 3 very popular external services for sending notifications.

1. [AWS Simple Email Service](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SES.html) - Its one of the EmailProvider for sending email messages.
2. [AWS Simple Notification Service](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html) - Its one of the SMSProvider for sending SMS notifications.
3. [Pubnub](https://www.pubnub.com/docs/nodejs-javascript/pubnub-javascript-sdk) - Its one of the PushProvider for sending realtime push notifications to mobile applications as well as web applications.
4. [Socket.IO](https://socket.io/docs/) - Its one of the PushProvider for sending realtime push notifications to mobile applications as well as web applications.

You can use one of these services or add your own implementation or integration using the same interfaces and attach it as a provider for that specific type.

## Install

```sh
npm install loopback4-notifications
```

## Usage

In order to use this component into your LoopBack application, please follow below steps.

Add component to application.

```ts
// application.ts
import {NotificationsComponent} from 'loopback4-notifications';
....

export class NotificationServiceApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    ....

    this.component(NotificationsComponent);
    ....
  }
}
```

After the above, you need to configure one of the notification provider at least. Based upon the requirement, please choose and configure the respective provider for sending notifications. See below.

### Email Notifications

This extension provides in-built support of AWS Simple Email Service integration for sending emails from the application. In order to use it, just bind the SesProvider as below in application.ts.

```ts
import {
  NotificationsComponent,
  NotificationBindings,
  SesProvider
} from 'loopback4-notifications';
....

export class NotificationServiceApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    ....

    this.component(NotificationsComponent);
    this.bind(NotificationBindings.EmailProvider).toProvider(SesProvider);
    ....
  }
}
```

There are some additional configurations needed in order to allow SES to connect to AWS. You need to add them as below. Make sure these are added before the provider binding.

```ts
import {
  NotificationsComponent,
  NotificationBindings,
  SESBindings,
  SesProvider
} from 'loopback4-notifications';
....

export class NotificationServiceApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    ....

    this.component(NotificationsComponent);
    this.bind(SESBindings.Config).to({
      accessKeyId: process.env.SES_ACCESS_KEY_ID,
      secretAccessKey: process.env.SES_SECRET_ACCESS_KEY,
      region: process.env.SES_REGION,
    });
    this.bind(NotificationBindings.EmailProvider).toProvider(SesProvider);
    ....
  }
}
```

All the configurations as specified by AWS docs [here](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SES.html#constructor-property) are supported in above SESBindings.Config key.

In addition to this, some general configurations can also be done, like below.

```ts
import {
  NotificationsComponent,
  NotificationBindings,
  SESBindings,
  SesProvider
} from 'loopback4-notifications';
....

export class NotificationServiceApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    ....

    this.component(NotificationsComponent);
    this.bind(NotificationBindings.Config).to({
      sendToMultipleReceivers: false,
      senderEmail: 'support@myapp.com'
    });
    this.bind(SESBindings.Config).to({
      accessKeyId: process.env.SES_ACCESS_KEY_ID,
      secretAccessKey: process.env.SES_SECRET_ACCESS_KEY,
      region: process.env.SES_REGION,
    });
    this.bind(NotificationBindings.EmailProvider).toProvider(SesProvider);
    ....
  }
}
```

Possible configuration options for the above are mentioned below.

| Option                  | Type    | Description                                                                                                                                                            |
| ----------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| sendToMultipleReceivers | boolean | If set to true, single email will be sent to all receivers mentioned in payload. If set to false, multiple emails will be sent for each receiver mentioned in payload. |
| senderEmail             | string  | This will be used as from email header in sent email.                                                                                                                  |

If you wish to use any other service provider of your choice, you can create a provider for the same, similar to SesProvider we have. Add that provider in place of SesProvider. Refer to the implementation [here](https://github.com/sourcefuse/loopback4-notifications/blob/master/src/providers/email/ses/).

```ts
this.bind(NotificationBindings.EmailProvider).toProvider(MyOwnProvider);
```

### SMS Notifications

This extension provides in-built support of AWS Simple Notification Service integration for sending SMS from the application. In order to use it, just bind the SnsProvider as below in application.ts.

```ts
import {
  NotificationsComponent,
  NotificationBindings,
  SnsProvider
} from 'loopback4-notifications';
....

export class NotificationServiceApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    ....

    this.component(NotificationsComponent);
    this.bind(NotificationBindings.SMSProvider).toProvider(SnsProvider);
    ....
  }
}
```

There are some additional configurations needed in order to allow SNS to connect to AWS. You need to add them as below. Make sure these are added before the provider binding.

```ts
import {
  NotificationsComponent,
  NotificationBindings,
  SNSBindings,
  SnsProvider
} from 'loopback4-notifications';
....

export class NotificationServiceApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    ....

    this.component(NotificationsComponent);
    this.bind(SNSBindings.Config).to({
      accessKeyId: process.env.SNS_ACCESS_KEY_ID,
      secretAccessKey: process.env.SNS_SECRET_ACCESS_KEY,
      region: process.env.SNS_REGION,
    });
    this.bind(NotificationBindings.SMSProvider).toProvider(SnsProvider);
    ....
  }
}
```

All the configurations as specified by AWS docs [here](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html#constructor-property) are supported in above SNSBindings.Config key.

If you wish to use any other service provider of your choice, you can create a provider for the same, similar to SnsProvider we have. Add that provider in place of SnsProvider.Refer to the implementation [here](https://github.com/sourcefuse/loopback4-notifications/blob/master/src/providers/sms/sns/).

```ts
this.bind(NotificationBindings.SMSProvider).toProvider(MyOwnProvider);
```

### Push Notifications

This extension provides in-built support of Pubnub integration for sending realtime push notifications from the application. In order to use it, just bind the PushProvider as below in application.ts.

```ts
import {
  NotificationsComponent,
  NotificationBindings,
  PubNubProvider
} from 'loopback4-notifications';
....

export class NotificationServiceApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    ....

    this.component(NotificationsComponent);
    this.bind(NotificationBindings.PushProvider).toProvider(PubNubProvider);
    ....
  }
}
```

There are some additional configurations needed in order to allow Pubnub connection. You need to add them as below. Make sure these are added before the provider binding.

```ts
import {
  NotificationsComponent,
  NotificationBindings,
  PubnubBindings,
  PubNubProvider
} from 'loopback4-notifications';
....

export class NotificationServiceApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    ....

    this.component(NotificationsComponent);
    this.bind(PubNubProvider.Config).to({
      subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY,
      publishKey: process.env.PUBNUB_PUBLISH_KEY,
      secretKey: process.env.PUBNUB_SECRET_KEY,
      ssl: true,
      logVerbosity: true,
      uuid: 'my-app',
      cipherKey: process.env.PUBNUB_CIPHER_KEY,
      apns2Env: 'production',
      apns2BundleId: 'com.app.myapp'
    });
    this.bind(NotificationBindings.PushProvider).toProvider(PubNubProvider);
    ....
  }
}
```

All the configurations as specified by Pubnub docs [here](https://www.pubnub.com/docs/web-javascript/api-reference-configuration) are supported in above PubNubProvider.Config key.

Additionally, PubNubProvider also supports Pubnub Access Manager integration. Refer [docs](https://www.pubnub.com/docs/platform/security/access-control#overview) here for details.

For PAM support, PubNubProvider exposes two more methods - grantAccess and revokeAccess. These can be used to grant auth tokens and revoke them from Pubnub.

If you wish to use any other service provider of your choice, you can create a provider for the same, similar to PubNubProvider we have. Add that provider in place of PubNubProvider. Refer to the implementation [here](https://github.com/sourcefuse/loopback4-notifications/blob/master/src/providers/push/pubnub/).

```ts
this.bind(NotificationBindings.SMSProvider).toProvider(MyOwnProvider);
```

### Push Notifications With Socket.io

This extension provides in-built support of Socket.io integration for sending realtime notifications from the application. In order to use it, just bind the PushProvider as below in application.ts.

This provider sends the message to the channel passed via config (or while publishing) and accepts a fix interface to interact with.
The interface could be imported into the project by the name SocketMessage.

```ts
import {
  NotificationsComponent,
  NotificationBindings,
  SocketIOProvider
} from 'loopback4-notifications';
....

export class NotificationServiceApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    ....

    this.component(NotificationsComponent);
    this.bind(NotificationBindings.PushProvider).toProvider(SocketIOProvider);
    ....
  }
}
```

There are some additional configurations needed in order to allow Socket connection. You need to add them as below. Make sure these are added before the provider binding.

```ts
import {
  NotificationsComponent,
  NotificationBindings,
  SocketBindings,
  SocketIOProvider
} from 'loopback4-notifications';
....

export class NotificationServiceApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    ....

    this.component(NotificationsComponent);
    this.bind(SocketBindings.Config).to({
      url: process.env.SOCKETIO_SERVER_URL
    });
    this.bind(NotificationBindings.PushProvider).toProvider(SocketIOProvider);
    ....
  }
}
```

If you wish to use any other service provider of your choice, you can create a provider for the same, similar to SocketIOProvider we have. Add that provider in place of SocketIOProvider. Refer to the implementation [here](https://github.com/sourcefuse/loopback4-notifications/blob/master/src/providers/push/socketio/).

```ts
this.bind(NotificationBindings.PushProvider).toProvider(MyOwnProvider);
```

### Controller Usage

Once the providers are set, the implementation of notification is very easy. Just add an entity implementing the Message interface provided by the component. For specific type, you can also implement specific interfaces like, SMSMessage, PushMessage, EmailMessage. See example below.

```ts
import {Entity, model, property} from '@loopback/repository';
import {
  Message,
  Receiver,
  MessageType,
  MessageOptions,
} from 'loopback4-notifications';

@model({
  name: 'notifications',
})
export class Notification extends Entity implements Message {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    jsonSchema: {
      nullable: true,
    },
  })
  subject?: string;

  @property({
    type: 'string',
    required: true,
  })
  body: string;

  @property({
    type: 'object',
    required: true,
  })
  receiver: Receiver;

  @property({
    type: 'number',
    required: true,
  })
  type: MessageType;

  @property({
    type: 'date',
    name: 'sent',
  })
  sentDate: Date;

  @property({
    type: 'object',
  })
  options?: MessageOptions;

  constructor(data?: Partial<Notification>) {
    super(data);
  }
}
```

After this, you can publish notification from controller API methods as below. You don't need to invoke different methods for different notification. Same publish method will take care of it based on message type sent in request body.

```ts
export class NotificationController {
  constructor(
    ....
    @inject(NotificationBindings.NotificationProvider)
    private readonly notifProvider: INotification,
    ....
  ) {}

    @post('/notifications', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Notification model instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Notification)},
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Notification, {exclude: ['id']}),
        },
      },
    })
    notification: Omit<Notification, 'id'>,
  ): Promise<Notification> {
    await this.notifProvider.publish(notification);
  }
}
```

As you can see above, one controller method can now cater to all the different type of notifications.

## Feedback

If you've noticed a bug or have a question or have a feature request, [search the issue tracker](https://github.com/sourcefuse/loopback4-notifications/issues) to see if someone else in the community has already created a ticket.
If not, go ahead and [make one](https://github.com/sourcefuse/loopback4-notifications/issues/new/choose)!
All feature requests are welcome. Implementation time may vary. Feel free to contribute the same, if you can.
If you think this extension is useful, please [star](https://help.github.com/en/articles/about-stars) it. Appreciation really helps in keeping this project alive.

## Contributing

Please read [CONTRIBUTING.md](https://github.com/sourcefuse/loopback4-notifications/blob/master/.github/CONTRIBUTING.md) for details on the process for submitting pull requests to us.

## Code of conduct

Code of conduct guidelines [here](https://github.com/sourcefuse/loopback4-notifications/blob/master/.github/CODE_OF_CONDUCT.md).

## License

[MIT](https://github.com/sourcefuse/loopback4-notifications/blob/master/LICENSE)
