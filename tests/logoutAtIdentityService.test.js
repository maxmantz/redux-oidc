import 'babel-polyfill';
import logoutAtIdentityService from '../src/helpers/logoutAtIdentityService';
import expect from 'expect';
import sinon from 'sinon';

// require('./testdom')('<html><head></head><body></body></html>');

describe('logoutAtIdentityService(config)', () => {
  let redirectForLogoutStub;
  let createTokenManagerStub;
  
  beforeEach(() => {
    redirectForLogoutStub = sinon.stub();
    const tokenManager = { redirectForLogout: redirectForLogoutStub };
    createTokenManagerStub = sinon.stub();
    createTokenManagerStub.returns(tokenManager);
    logoutAtIdentityService.__Rewire__('createTokenManager', createTokenManagerStub);
  });

  it('should call the redirectForLogout method', () => {
    logoutAtIdentityService();
    expect(redirectForLogoutStub.called).toEqual(true);
  });
});
