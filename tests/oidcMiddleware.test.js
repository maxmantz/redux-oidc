import './setup';

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import createOidcMiddleware, { getUserCallback, errorCallback, setStoredUser, removeStoredUser, storedUser, getNext, setNext, middlewareHandler } from '../src/oidcMiddleware';
import { userExpired, userFound, loadingUser, loadUserError } from '../src/actions';

describe('createOidcMiddleware()', function () {
  let userManagerMock;
  let getUserMock;
  let thenMock;
  let catchMock;
  let nextMock;
  let storeMock;
  let action;
  let stateMock;
  let storageMock;
  let getAllKeysMock;
  let pathname = '/callback';
  let callbackRoute = '/callback';

  beforeEach(function () {
    getUserMock = vi.fn();
    thenMock = vi.fn();
    catchMock = vi.fn();

    thenMock.mockReturnValue({
      catch: catchMock
    });
    getUserMock.mockReturnValue({
      then: thenMock
    });
    userManagerMock = {
      getUser: getUserMock
    };

    action = {
      type: 'SOME_ACTION'
    };

    nextMock = vi.fn().mockReturnValue(action)
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

    nextFunction = nextFunction(nextMock);
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

    middlewareHandler(nextMock, action, userManagerMock);

    expect(nextMock).toHaveBeenCalledWith(action)
    expect(nextMock).not.toHaveBeenCalledWith(userExpired());
    expect(getUserMock).not.toHaveBeenCalled();
  });

  it('middlewareHandler should handle an expired user correctly', () => {
    const expiredUser = { expired: true };
    setStoredUser(expiredUser);
    setNext(nextMock);

    getUserCallback(expiredUser);

    expect(nextMock).toHaveBeenCalledWith(userExpired())
  });

  it('middlewareHandler should handle a valid user correctly', () => {
    const validUser = { some: 'user' };
    setStoredUser(null);
    getUserMock.mockReturnValue(validUser);
    setNext(nextMock);

    getUserCallback(validUser);

    expect(nextMock).toHaveBeenCalledWith(userFound(validUser))
    expect(storedUser).toEqual(validUser);
  });

  it('middlwareHandler should not check the stored user when the action type is LOADING_USER', () => {
    action = loadingUser();
    setStoredUser(null);

    middlewareHandler(nextMock, action, userManagerMock);

    expect(nextMock).toHaveBeenCalledWith(action)
    expect(getUserMock).not.toHaveBeenCalled();
  });

  it('middlwareHandler should not check the stored user when the action type is USER_EXPIRED', () => {
    action = userExpired();
    setStoredUser(null);

    middlewareHandler(nextMock, action, userManagerMock);

    expect(nextMock).toHaveBeenCalledWith(action)
    expect(nextMock).not.toHaveBeenCalledWith(loadingUser());
    expect(getUserMock).not.toHaveBeenCalled();
  });

  it('should set the next middleware', () => {
    setStoredUser({ some: 'user' });
    setNext(null);

    middlewareHandler(nextMock, action, userManagerMock);

    expect(getNext()).toEqual(nextMock);
  });

  it('errorCallback should dispatch LOAD_USER_ERROR', () => {
    setNext(nextMock);

    errorCallback({ message: 'Some message!' });

    expect(nextMock).toHaveBeenCalledWith(loadUserError())
  });

  it('middleware should not call userManagers getUser when the action type is USER_FOUND', () => {
    middlewareHandler(nextMock, userFound(), userManagerMock);

    expect(getUserMock).not.toHaveBeenCalled();
    expect(nextMock).toHaveBeenCalledTimes(1)
  });
});
