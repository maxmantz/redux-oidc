import sinon from 'sinon';
import { logout, createTokenManager } from '../src/helpers';
import expect from 'expect';

// require('./testdom')('<html><head></head><body></body></html>');

describe('logout()', () => {
  let removeTokenStub;
  let createTokenManagerStub;
  beforeEach(() => {
    const tokenManager = createTokenManager();
    removeTokenStub = sinon.stub(tokenManager, 'removeToken');
    removeTokenStub.returns(null);
    createTokenManagerStub = sinon.stub(createTokenManager);
    createTokenManagerStub.returns(tokenManager);
  });

  afterEach(() => {
    removeTokenStub.restore();
    createTokenManagerStub.restore();
  });

  it('should call the removeToken function', () => {
    logout();
    expect(removeTokenStub.called).toBe(true)
  });
});
