import {expect} from '@loopback/testlab';
import sinon from 'sinon';
import {SocketIOProvider} from '../../providers';

describe('Socketio Service', () => {
  describe('socketio configration addition', () => {
    afterEach(() => sinon.reset());
    it('returns error message when no socketio config', async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const socketioProvider = new SocketIOProvider();
      } catch (err) {
        const result = err.message;
        expect(result).which.eql('Socket Config missing !');
      }
    });
  });
});
