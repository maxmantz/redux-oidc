import '../setup';

import { describe, it, expect, vi, beforeEach } from "vitest";
import loadUserHandler, { getUserCallback, errorCallback, setReduxStore, getReduxStore } from '../../src/helpers/loadUser';
import { userExpired, userFound, loadUserError, loadingUser } from '../../src/actions';

describe('helper - loadUser()', () => {
  let userManagerMock;
  let storeMock;
  let getUserMock;
  let dispatchMock;
  let thenMock;
  let catchMock;

  beforeEach(() => {
    dispatchMock = vi.fn();
    getUserMock = vi.fn();
    thenMock = vi.fn();
    catchMock = vi.fn();

    userManagerMock = {
      getUser: getUserMock
    };

    storeMock = {
      dispatch: dispatchMock
    };

    getUserMock.mockReturnValue(new Promise(() => {}));

    thenMock.mockReturnValue({
      catch: catchMock
    });

    setReduxStore(storeMock);
  });

  it('should dispatch a valid user to the store', () => {
    const validUser = { some: 'user' };

    getUserCallback(validUser);

    expect(dispatchMock).toHaveBeenCalledWith(userFound(validUser))
  });

  it('should dispatch USER_EXPIRED when no valid user is present', () => {
    const invalidUser = { expired: true };

    getUserCallback(invalidUser);

    expect(dispatchMock).toHaveBeenCalledWith(userExpired())
  });

  it('should set the redux store', () => {
    loadUserHandler(storeMock, userManagerMock);

    expect(getReduxStore() === storeMock).toBeTruthy()
  });

  it('errorCallback should dispatch LOAD_USER_ERROR', () => {
    setReduxStore(storeMock);

    errorCallback({ message: 'Some message!'});

    expect(dispatchMock).toHaveBeenCalledWith(loadUserError())
  });

  it('loadUserCallback returns the user', () => {
    const user = {
      some: 'user'
    };

    const result1 = getUserCallback(user);
    expect(result1).toEqual(user);

    const expiredUser = {
      expired: true
    };

    const result2 = getUserCallback(expiredUser);
    expect(result2).toEqual(expiredUser);
  });

  it ('loadUserCallback should dispatch USER_EXPIRED when the user returned is null', () => {
    getUserCallback(null);
    expect(dispatchMock).toHaveBeenCalledWith(userExpired())
  });

  it('loadUser should dispatch LOADING_USER', () => {
    loadUserHandler(storeMock, userManagerMock);

    expect(dispatchMock).toHaveBeenCalledWith(loadingUser())
  });

  it('loadUser should return a promise', () => {
    const promise = loadUserHandler(storeMock, userManagerMock);

    expect(promise).toBeInstanceOf(Promise);
  });
});
