import './setup';
import sinon from 'sinon';
import expect from 'expect';
import createOidcMiddleware, { getUserSuccessCallback, getUserErrorCallback, setStoredUser, removeStoredUser, storedUser, middlewareHandler } from '../src/oidcMiddleware';
import { userExpired, userFound, loadingUser } from '../src/actions';

const coMocha = require('co-mocha');
const mocha = require('mocha');
coMocha(mocha);

describe('createOidcMiddleware()', function () {
  let userManagerMock;
  let getUserStub;
  let nextStub;
  let storeMock;
  let action;
  let stateMock;
  let storageMock;
  let getAllKeysStub;
  let callbackRoute = '/callback';

  beforeEach(function () {
    getUserStub = sinon.stub();

    userManagerMock = {
      getUser: getUserStub,
      settings: {
        redirect_uri: `https://my-site.local${callbackRoute}`
      }
    };

    action = {
      type: 'SOME_ACTION'
    };

    nextStub = sinon.stub().returns(action);
  });

  afterEach(function () {
    removeStoredUser();
  });

  it('should return the correct middleware function', function* () {
    const middleware = createOidcMiddleware(userManagerMock);

    expect(typeof(middleware)).toEqual('function');
    expect(middleware.length).toEqual(1);

    let nextFunction = middleware(storeMock);
    expect(typeof(nextFunction)).toEqual('function');
    expect(nextFunction.length).toEqual(1);

    nextFunction = nextFunction(nextStub);
    expect(typeof(nextFunction)).toEqual('function');
    expect(nextFunction.length).toEqual(1);
  });

  it('should throw an error when no user manager has been provided', function* () {
    expect(() => {createOidcMiddleware(null)}).toThrow(/You must provide a user manager!/);
    expect(() => {createOidcMiddleware({})}).toThrow(/You must provide a user manager!/);
    expect(() => {createOidcMiddleware('userManager')}).toThrow(/You must provide a user manager!/);
  });

  it('middlewareHandler should not check the storage & trigger validation when the user is present', function* () {
    setStoredUser({ some: 'user' });

    const iterator = middlewareHandler(nextStub, action, userManagerMock);
    let current = iterator.next();

    expect(nextStub.calledWith(action)).toEqual(true);
    expect(nextStub.calledWith(userExpired())).toEqual(false);
    expect(getUserStub.called).toEqual(false);
    expect(current.done).toEqual(true);
  });

  it('middlewareHandler should handle an expired user correctly', function* () {
    const expiredUser = { expired: true };
    setStoredUser(expiredUser);
    getUserStub.returns(expiredUser);

    yield* middlewareHandler(nextStub, action, userManagerMock);

    expect(getUserStub.called).toEqual(true);
    expect(nextStub.calledWith(loadingUser())).toEqual(true);
    expect(nextStub.calledWith(userExpired())).toEqual(true);
    expect(nextStub.calledWith(action)).toEqual(true);
  });

  it('middlewareHandler should handle a valid user correctly', function* () {
    const validUser = { some: 'user' };
    getUserStub.returns(validUser);

    yield* middlewareHandler(nextStub, action, userManagerMock);

    expect(nextStub.calledWith(userFound(validUser))).toEqual(true);
    expect(nextStub.calledWith(action)).toEqual(true);
  });

  it('middlewareHandler should store user when loaded', function* () {
    const user = { some: 'user' };
    action = userFound(user);
    setStoredUser(null);

    yield* middlewareHandler(nextStub, action, userManagerMock);

    expect(nextStub.calledWith(action)).toEqual(true);
    expect(storedUser).toEqual(user);
  });

  it('middlewareHandler should not handle a valid user when on the callback route', function* () {
    const expiredUser = { expired: true };
    setStoredUser(expiredUser);
    getUserStub.returns(expiredUser);
    global.window = { location: { pathname: '/callback' } };

    yield* middlewareHandler(nextStub, action, userManagerMock);

    expect(nextStub.calledOnce).toEqual(true);
    expect(nextStub.calledWith(action)).toEqual(true);
  });

  it('middlwareHandler should not check the stored user when the action type is LOADING_USER', function* () {
    action = loadingUser();
    setStoredUser(null);
    yield* middlewareHandler(nextStub, action, userManagerMock);

    expect(nextStub.calledWith(action)).toEqual(true);
    expect(getUserStub.called).toEqual(false);
  });

  it('middlwareHandler should not check the stored user when the action type is USER_EXPIRED', function* () {
    action = userExpired();
    setStoredUser(null);
    yield* middlewareHandler(nextStub, action, userManagerMock);

    expect(nextStub.calledWith(action)).toEqual(true);
    expect(nextStub.calledWith(loadingUser())).toEqual(false);
    expect(getUserStub.called).toEqual(false);
  });
});
