import './setup';
import sinon from 'sinon';
import expect from 'expect';
import createOidcMiddleware, { getUserCallback, errorCallback, setStoredUser, removeStoredUser, storedUser, getNext, setNext, middlewareHandler } from '../src/oidcMiddleware';
import { userExpired, userFound, loadingUser, loadUserError } from '../src/actions';

describe('createOidcMiddleware()', function () {
  let userManagerMock;
  let getUserStub;
  let thenStub;
  let catchStub;
  let nextStub;
  let storeMock;
  let action;
  let stateMock;
  let storageMock;
  let getAllKeysStub;
  let pathname = '/callback';
  let callbackRoute = '/callback';

  beforeEach(function () {
    getUserStub = sinon.stub();
    thenStub = sinon.stub();
    catchStub = sinon.stub();

    thenStub.returns({
      catch: catchStub
    });
    getUserStub.returns({
      then: thenStub
    });
    userManagerMock = {
      getUser: getUserStub
    };

    action = {
      type: 'SOME_ACTION'
    };

    nextStub = sinon.stub().returns(action);
  });

  afterEach(function () {
    removeStoredUser();
  });

  it('should return the correct middleware function', () => {
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

  it('should throw an error when no user manager has been provided', () => {
    expect(() => {createOidcMiddleware(null)}).toThrow(/You must provide a user manager!/);
    expect(() => {createOidcMiddleware({})}).toThrow(/You must provide a user manager!/);
    expect(() => {createOidcMiddleware('userManager')}).toThrow(/You must provide a user manager!/);
  });

  it('middlewareHandler should not check the storage & trigger validation when the user is present', () => {
    setStoredUser({ some: 'user' });

    middlewareHandler(nextStub, action, userManagerMock);

    expect(nextStub.calledWith(action)).toEqual(true);
    expect(nextStub.calledWith(userExpired())).toEqual(false);
    expect(getUserStub.called).toEqual(false);
  });

  it('middlewareHandler should handle an expired user correctly', () => {
    const expiredUser = { expired: true };
    setStoredUser(expiredUser);
    setNext(nextStub);

    getUserCallback(expiredUser);

    expect(nextStub.calledWith(userExpired())).toEqual(true);
  });

  it('middlewareHandler should handle a valid user correctly', () => {
    const validUser = { some: 'user' };
    setStoredUser(null);
    getUserStub.returns(validUser);
    setNext(nextStub);

    getUserCallback(validUser);

    expect(nextStub.calledWith(userFound(validUser))).toEqual(true);
    expect(storedUser).toEqual(validUser);
  });

  it('middlwareHandler should not check the stored user when the action type is LOADING_USER', () => {
    action = loadingUser();
    setStoredUser(null);

    middlewareHandler(nextStub, action, userManagerMock);

    expect(nextStub.calledWith(action)).toEqual(true);
    expect(getUserStub.called).toEqual(false);
  });

  it('middlwareHandler should not check the stored user when the action type is USER_EXPIRED', () => {
    action = userExpired();
    setStoredUser(null);

    middlewareHandler(nextStub, action, userManagerMock);

    expect(nextStub.calledWith(action)).toEqual(true);
    expect(nextStub.calledWith(loadingUser())).toEqual(false);
    expect(getUserStub.called).toEqual(false);
  });

  it('should set the next middleware', () => {
    setStoredUser({ some: 'user' });
    setNext(null);

    middlewareHandler(nextStub, action, userManagerMock);

    expect(getNext()).toEqual(nextStub);
  });

  it('errorCallback should dispatch LOAD_USER_ERROR', () => {
    setNext(nextStub);

    errorCallback({ message: 'Some message!' });

    expect(nextStub.calledWith(loadUserError())).toEqual(true);
  });

  it('middleware should not call userManagers getUser when the action type is USER_FOUND', () => {
    middlewareHandler(nextStub, userFound(), userManagerMock);

    expect(getUserStub.called).toEqual(false);
    expect(nextStub.calledOnce).toEqual(true);
  });
});
