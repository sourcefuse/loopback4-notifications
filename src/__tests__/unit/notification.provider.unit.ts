import {
  createStubInstance,
  expect,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import sinon from 'sinon';
import {INotification} from '../..';
import {NodemailerProvider, NotificationProvider} from '../../providers';

const msg = {
  body: 'test body',
  receiver: {
    to: [
      {
        id: 'dummy',
        ['key']: 'key',
      },
    ],
  },
  sentDate: new Date(),
  type: 1,
};

describe('Notification Service', () => {
  let publish: sinon.SinonStub;
  let emailProvider: StubbedInstanceWithSinonAccessor<NodemailerProvider>;
  let notificationProvider: NotificationProvider;
  const newError = new Error('ProviderNotFound');
  afterEach(() => sinon.restore());
  beforeEach(setUp);

  describe('publish the message and returns it', () => {
    it('returns the message', async () => {
      const data = emailProvider.stubs.value;
      data.resolves(msg);
      const result = await notificationProvider
        .publish(msg)
        .catch(() => newError);
      expect(result).which.eql(msg);
    });

    it('returns the error message when there is no provider', async () => {
      const result = await new NotificationProvider()
        .value()
        .publish(msg)
        .catch(err => err.message);
      expect(result).which.eql('ProviderNotFound');
    });
  });

  function setUp() {
    emailProvider = createStubInstance(NodemailerProvider);
    notificationProvider = new NotificationProvider(
      {} as INotification,
      {} as INotification,
      {} as INotification,
    );
    notificationProvider = {value: sinon.stub(), publish: sinon.stub()};
    publish = notificationProvider.publish as sinon.SinonStub;
    publish.resolves(msg);
  }
});
