import {inject, Provider} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import * as io from 'socket.io-client';
import {SocketBindings} from './keys';
import {SocketConfig, SocketMessage, SocketNotification} from './types';

export class SocketIOProvider implements Provider<SocketNotification> {
  constructor(
    @inject(SocketBindings.Config, {
      optional: true,
    })
    private readonly socketConfig?: SocketConfig,
  ) {
    if (this.socketConfig) {
      this.socketService = io.connect(this.socketConfig.url);
    } else {
      throw new HttpErrors.PreconditionFailed('Socket Config missing !');
    }
  }

  socketService: SocketIOClient.Socket;

  value() {
    return {
      publish: async (message: SocketMessage) => {
        if (message.receiver.to.length === 0) {
          throw new HttpErrors.BadRequest(
            'Message receiver not found in request',
          );
        }

        /**
         * This method is responsible to send all the required data to socket server
         * The socket server needs to parse the data and send the message to intended
         * user.
         */
        const publishes = message.receiver.to.map(receiver => {
          const publishConfig = {
            channel: receiver.id,
            message: {
              title: message.subject,
              description: message.body,
            },
          };

          return this.socketService.emit(JSON.stringify(publishConfig));
        });

        await Promise.all(publishes);
      },
    };
  }
}
