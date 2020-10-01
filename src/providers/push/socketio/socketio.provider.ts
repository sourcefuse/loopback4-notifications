import {inject, Provider} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import io from 'socket.io-client';
import {SocketBindings} from './keys';
import {SocketConfig, SocketMessage, SocketNotification} from './types';

export class SocketIOProvider implements Provider<SocketNotification> {
  constructor(
    @inject(SocketBindings.Config, {
      optional: true,
    })
    private readonly socketConfig?: SocketConfig,
  ) {
    if (this.socketConfig && this.socketConfig.url) {
      this.socketService = io(this.socketConfig.url);
    } else {
      throw new HttpErrors.PreconditionFailed('Socket Config missing !');
    }
  }

  socketService: SocketIOClient.Socket;

  value() {
    return {
      publish: async (message: SocketMessage) => {
        if (message?.receiver?.to?.length > 0) {
          /**
           * This method is responsible to send all the required data to socket server
           * The socket server needs to parse the data and send the message to intended
           * user.
           *
           * emitting a message to channel passed via config
           */

          if (!this.socketConfig || !this.socketConfig.defaultPath) {
            throw new HttpErrors.PreconditionFailed(
              'Channel info is missing !',
            );
          }
          this.socketService.emit(
            message.options?.path || this.socketConfig.defaultPath,
            JSON.stringify(message),
          );
        } else {
          throw new HttpErrors.BadRequest('Message receiver not found');
        }
      },
    };
  }
}
