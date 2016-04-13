import expect from 'expect';
import sinon from 'sinon';
import triggerAuthFlow from '../src/helpers/triggerAuthFlow';
import { STORAGE_KEY } from '../src/constants';

describe('triggerAuthFlow(config, redirectTo)', () => {
  let createTokenManagerStub;
  let removeTokenStub;
  let redirectForTokenStub;
  let setItemStub;
  let oldStorage;
  let tokenManagerMock;
  let oldWindow;
  const defaultHref = 'default';
  beforeEach(() => {
    oldStorage = localStorage;
    setItemStub = sinon.stub();
    oldWindow = window;
    window = {
      location: {
        href: defaultHref
      },
      localStorage: {
        setItem: setItemStub
      }
    };

    createTokenManagerStub = sinon.stub();
    removeTokenStub = sinon.stub();
    redirectForTokenStub = sinon.stub();
    tokenManagerMock = {
      removeToken: removeTokenStub,
      redirectForToken: redirectForTokenStub,
      expired: true
    };

    createTokenManagerStub.returns(tokenManagerMock);
    triggerAuthFlow.__Rewire__('createTokenManager', createTokenManagerStub);
  });

  it('should create a token manager instance', () => {
    const config = { some: 'value' };
    triggerAuthFlow(config);

    expect(createTokenManagerStub.calledWith(config)).toEqual(true);
  });

  it('should set the current window location in localStorage if no redirectTo has been provided', () => {
    triggerAuthFlow({});

    expect(setItemStub.calledWith(STORAGE_KEY, defaultHref)).toEqual(true);
  });

  it('should set the redirectTo value in localStorage when provided', () => {
    const redirectTo = 'https://some.url.com';

    triggerAuthFlow({}, redirectTo);

    expect(setItemStub.calledWith(STORAGE_KEY, redirectTo)).toEqual(true);
  });

  it('should call the removeToken() function', () => {
    triggerAuthFlow({});

    expect(removeTokenStub.called).toEqual(true);
  });

  it('should call the redirectForToken() function', () => {
    triggerAuthFlow({});
    expect(redirectForTokenStub.called).toEqual(true);
  });

  afterEach(() => {
    window = oldWindow;
  })
})
