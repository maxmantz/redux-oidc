import 'babel-polyfill';
import sinon from 'sinon';
import expect from 'expect';
import proxyquire from 'proxyquire';
import logout from '../src/helpers/logout';
// require('./testdom')('<html><head></head><body></body></html>');

describe('logout()', () => {
  let removeTokenStub;
  let createTokenManagerStub;
  let helpers;
  beforeEach(() => {
    removeTokenStub = sinon.stub();
    removeTokenStub.returns(null);
    const tokenManager = { removeToken: removeTokenStub };
    createTokenManagerStub = sinon.stub();
    createTokenManagerStub.returns(tokenManager);
    logout.__Rewire__('createTokenManager', createTokenManagerStub);
  });

  it('should call the removeToken function', () => {
    logout();
    expect(removeTokenStub.called).toEqual(true)
  });
});
