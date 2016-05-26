import 'babel-polyfill';
import '../setup';
import sinon from 'sinon';
import expect from 'expect';
import processSilentRenew from '../../src/helpers/processSilentRenew'

describe('helper - processSilentRenew()', () => {
  let createUserManagerMock;
  let signinSilentCallbackStub;

  beforeEach(() => {
    signinSilentCallbackStub = sinon.stub();
    createUserManagerMock = sinon.stub().returns({
      signinSilentCallback: signinSilentCallbackStub
    });

    processSilentRenew.__Rewire__('createUserManager', createUserManagerMock);
  });

  afterEach(() => {
    processSilentRenew.__ResetDependency__('createUserManager');
  });

  it('should handle the silent callback correctly', () => {
    processSilentRenew();

    expect(signinSilentCallbackStub.called).toEqual(true);
  });
});
