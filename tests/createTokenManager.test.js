import { createTokenManager } from '../src/helpers';
import expect from 'expect';
import jsdom from 'mocha-jsdom';

describe("createTokenManager() function", () => {
  jsdom();
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
