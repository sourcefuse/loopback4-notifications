import {Constructor} from '@loopback/core';
import {expect, sinon} from '@loopback/testlab';
import proxyquire from 'proxyquire';
import {SocketIOProvider} from '../../providers';
import {SocketMessage} from '../../providers/push/socketio/types';

describe('Socketio Service', () => {
  let SocketMockProvider: Constructor<SocketIOProvider>;
  const configration = {
    url: 'dummyurl',
    defaultPath: 'default',
    options: {
      path: 'custompath',
    },
  };
  beforeEach(setupMockSocketIo);
  describe('socketio configration addition', () => {
    it('returns error message when no socketio config', async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const socketioProvider = new SocketMockProvider();
      } catch (err) {
        const result = err.message;
        expect(result).which.eql('Socket Config missing !');
      }
    });
    it('returs error message when receiver not found', async () => {
      const socketioProvider = new SocketMockProvider(configration).value();
      const message: SocketMessage = {
        body: 'dummy',
        sentDate: new Date(),
        type: 0,
        receiver: {
          to: [],
        },
      };

      const result = await socketioProvider
        .publish(message)
        .catch(err => err.message);
      expect(result).which.eql('Message receiver not found');
    });
    it('returns a promise to be fulfilled', async () => {
      const message: SocketMessage = {
        body: 'dummy',
        sentDate: new Date(),
        type: 0,
        receiver: {
          to: [
            {
              id: 'dummy',
              type: 0,
            },
          ],
        },
      };
      const socketioProvider = new SocketMockProvider(configration).value();
      const result = socketioProvider.publish(message);
      await expect(result).to.be.fulfilled();
    });
  });
  function setupMockSocketIo() {
    const mockSocket = sinon.stub().returns({
      emit: sinon.stub().returns({}),
    });
    SocketMockProvider = proxyquire(
      '../../providers/push/socketio/socketio.provider',
      {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'socket.io-client': mockSocket,
      },
    ).SocketIOProvider;
  }
});
