import { logoutAtIdentityService, createTokenManager } from '../src/helpers';
import expect from 'expect';

// require('./testdom')('<html><head></head><body></body></html>');

describe('logoutAtIdentityService(config)', () => {
  let redirectForLogoutStub;
  let createTokenManagerStub;
  beforeEach(() => {
    const tokenManager = createTokenManager();
    redirectForLogoutStub = sinon.stub(tokenManager, 'redirectForLogout');
    removeTokenStub.returns(null);
    createTokenManagerStub = sinon.stub(createTokenManager);
    createTokenManagerStub.returns(tokenManager);
  });

  it('should call the redirectForLogout method', () => {
    logoutAtIdentityService();
    expect(redirectForLogoutStub.called).toBe(true);
  });
});
