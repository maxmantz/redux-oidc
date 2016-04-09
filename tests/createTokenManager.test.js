
import { createTokenManager } from '../src/helpers';
import expect from 'expect';

//require('./testdom')('<html><head></head><body></body></html>');

describe("createTokenManager() function", () => {
  it('should return an OidcTokenManager instance', () => {
    const options = {};
    const tokenManager = createTokenManager(options);

    expect(typeof(tokenManager)).toEqual("TokenManager");
  });

  it('should throw an error when no options are passed', () => {
    const tokenManager = createTokenManager(null);

    expect(createTokenManager(null)).to.throw(Error);
  });
});
