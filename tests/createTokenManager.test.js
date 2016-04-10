import 'babel-polyfill';
import createTokenManager from '../src/helpers/createTokenManager';
import expect from 'expect';

describe('createTokenManager() function', () => {
  it('should return an OidcTokenManager instance', () => {
    const tokenManager = createTokenManager();

    expect(typeof(tokenManager)).toEqual('object');
    expect(typeof(tokenManager.redirectForLogout)).toEqual('function');
  });
});
