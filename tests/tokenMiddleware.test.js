import createTokenMiddleware from '../src/tokenMiddleware';
import sinon from 'sinon';
import expect from 'expect';
import { STORAGE_KEY } from '../src/constants';

describe('Token Middleware', () => {
  let config;
  let redirectForTokenStub;
  let createTokenManagerStub;
  let tokenManager;
  let getItemStub;
  let setItemStub;
  let store;
  let getStateStub;
  let next;
  let action;
  let oldStorage;
  beforeEach(() => {
    action = {type: 'SOME_ACTION'};
    config = {};
    redirectForTokenStub = sinon.stub()
    tokenManager = { redirectForToken: redirectForTokenStub, expired: false };
    createTokenManagerStub = sinon.stub();
    createTokenManagerStub.returns(tokenManager);
    getStateStub = sinon.stub();
    store = { getState: getStateStub };
    next = sinon.stub();

    expect(typeof(createTokenMiddleware)).toEqual('function');
    createTokenMiddleware.__Rewire__('createTokenManager', createTokenManagerStub);

    getItemStub = sinon.stub();
    setItemStub = sinon.stub();

    oldStorage = localStorage;
    localStorage = {
      getItem: getItemStub,
      setItem: setItemStub
    };
  });

  it('should return the correct middleware function', () => {
    const middleware = createTokenMiddleware(config);

    expect(typeof(middleware)).toEqual('function');
    expect(middleware.length).toEqual(1);

    let nextFunction = middleware(store);
    expect(typeof(nextFunction)).toEqual('function');
    expect(nextFunction.length).toEqual(1);

    nextFunction = nextFunction(next);
    expect(typeof(nextFunction)).toEqual('function');
    expect(nextFunction.length).toEqual(1);
  });

  it('should call the shouldValidate() function with the redux state and dispatched action', () => {
    const state = { some: 'value' };
    getStateStub.returns(state);
    next.returns(action);
    const shouldValidate = sinon.stub();
    createTokenMiddleware(config, shouldValidate)(store)(next)(action);

    expect(getStateStub.called).toEqual(true);
    expect(shouldValidate.calledWith(state, action)).toEqual(true);
  });

  it('should return the next action when token is valid', () => {
    next.returns('nextReturn');
    const middleware = createTokenMiddleware(config)(store)(next);

    const result = middleware(action);
    expect(result).toEqual('nextReturn');
    expect(next.calledWith(action)).toEqual(true);
  });

  it('should trigger the authentication flow, set the redirect url if the token is invalid & no redirect url is set', () => {
    next.returns('nextReturn');
    const middleware = createTokenMiddleware(config)(store)(next);
    tokenManager.expired = true;
    getItemStub.returns(null);

    middleware(action);

    expect(getItemStub.calledWith(STORAGE_KEY)).toEqual(true);
    expect(setItemStub.calledWith(STORAGE_KEY)).toEqual(true);
    expect(redirectForTokenStub.called).toEqual(true);
  });

  it('should not trigger the authentication flow when the redirect url is set', () => {
    getItemStub.returns('some url');
    const middleware = createTokenMiddleware(config)(store)(next);
    tokenManager.expired = true;

    middleware({});

    expect(getItemStub.called).toEqual(true);
    expect(redirectForTokenStub.called).toEqual(false);
  })

  it('should call next() with the action when it has been provided', () => {
    const middleware = createTokenMiddleware(config, null, action)(store)(next);
    tokenManager.expired = true;
    getItemStub.returns(null);

    middleware({});

    expect(next.calledWith(action)).toEqual(true);
  });

  it('should not trigger the token validation when shouldValidate returns false', () => {
    const shouldValidate = (state, action) => false;
    const middleware = createTokenMiddleware(config, shouldValidate);

    middleware({});

    expect(getItemStub.called).toEqual(false);
    expect(redirectForTokenStub.called).toEqual(false);
  });

  afterEach(() => {
    localStorage = oldStorage;
  });
})
