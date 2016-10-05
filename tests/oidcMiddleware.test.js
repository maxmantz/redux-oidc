import './setup';
import sinon from 'sinon';
import expect from 'expect';
import { STORAGE_KEY } from '../src/constants';
import createOidcMiddleware, { getUserSuccessCallback, getUserErrorCallback, setStoredUser, removeStoredUser, storedUser } from '../src/oidcMiddleware';
import { userExpired, userFound, loadingUser } from '../src/actions';

describe('createOidcMiddleware()', () => {
  let userManagerMock;
  let windowMock;
  let oldWindow;
  let localStorageMock;
  let oldStorage;
  let setItemStub;
  let getItemStub;
  let removeItemStub;
  let getUserStub;
  let signinRedirectStub;
  let thenStub;
  let catchStub;
  let nextStub;
  let storeMock;
  let getStateStub;
  let action;
  let stateMock;
  let pathname = '/callback';
  let callbackRoute = '/callback';

  beforeEach(() => {
    windowMock = {
      location: { pathname }
    };
    oldWindow = window;
    window = windowMock;

    setItemStub = sinon.stub();
    getItemStub = sinon.stub();
    removeItemStub = sinon.stub();
    localStorageMock = {
      setItem: setItemStub,
      getItem: getItemStub,
      removeItem: removeItemStub
    };
    oldStorage = localStorage;
    localStorage = localStorageMock;

    catchStub = sinon.stub();

    thenStub = sinon.stub().returns({
      catch: catchStub
    });

    getUserStub = sinon.stub().returns({
      then: thenStub
    });

    signinRedirectStub = sinon.stub();

    userManagerMock = {
      getUser: getUserStub,
      signinRedirect: signinRedirectStub
    };

    stateMock = { some: 'state' };
    getStateStub = sinon.stub().returns(stateMock);

    storeMock = {
      getState: getStateStub
    };

    action = {
      type: 'SOME_ACTION'
    };

    nextStub = sinon.stub().returns(action);
  });

  afterEach(() => {
    window = oldWindow;
    localStorage = oldStorage;
    removeStoredUser();
  });

  it('should return the correct middleware function', () => {
    const middleware = createOidcMiddleware(userManagerMock, null, null, callbackRoute);

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
    expect(() => {createOidcMiddleware(null, null, null, callbackRoute)}).toThrow(/You must provide a user manager!/);
    expect(() => {createOidcMiddleware({}, null, null, callbackRoute)}).toThrow(/You must provide a user manager!/);
    expect(() => {createOidcMiddleware('userManager', null, null, callbackRoute)}).toThrow(/You must provide a user manager!/);
  });

  it('should throw an error when no callback route has been provided', () =>  {
    expect(() => {createOidcMiddleware(userManagerMock, null, null, null)}).toThrow(/You must provide the callback route!/);
    expect(() => {createOidcMiddleware(userManagerMock, null, null, {})}).toThrow(/You must provide the callback route!/);
  });

  it('should call the shouldValidate() function with the redux state and dispatched action', () => {
    const shouldValidate = sinon.stub();
    createOidcMiddleware(userManagerMock, shouldValidate, null, callbackRoute)(storeMock)(nextStub)(action);

    expect(getStateStub.called).toEqual(true);
    expect(shouldValidate.calledWith(stateMock, action)).toEqual(true);
  });

  it('should trigger the validation when shouldValidate() returns true', () => {
    const shouldValidate = sinon.stub().returns(true);
    createOidcMiddleware(userManagerMock, shouldValidate, null, callbackRoute)(storeMock)(nextStub)(action);

    expect(setItemStub.calledWith(STORAGE_KEY, true)).toEqual(true);
    expect(getUserStub.called).toEqual(true);
    expect(thenStub.called).toEqual(true);
    expect(catchStub.calledWith(getUserErrorCallback)).toEqual(true);
  });

  it('should not trigger the validation when shouldValidate() returns false', () => {
    const shouldValidate = sinon.stub().returns(false);
    createOidcMiddleware(userManagerMock, shouldValidate, null, callbackRoute)(storeMock)(nextStub)(action);

    expect(setItemStub.called).toEqual(false);
    expect(getUserStub.called).toEqual(false);
    expect(thenStub.called).toEqual(false);
    expect(catchStub.called).toEqual(false);
  });

  it('should not trigger validation when the local storage key is set', () => {
    const shouldValidate = sinon.stub().returns(true);
    getItemStub.returns(true);
    const result = createOidcMiddleware(userManagerMock, shouldValidate, null, callbackRoute)(storeMock)(nextStub)(action);

    expect(setItemStub.called).toEqual(false);
    expect(getUserStub.called).toEqual(false);
    expect(thenStub.called).toEqual(false);
    expect(catchStub.called).toEqual(false);
    expect(nextStub.calledWith(action)).toEqual(true);
    expect(result).toEqual(action);
  });

  it('should not call localStorage and getUser() when the storedUser has been set', () => {
    setStoredUser({ some: 'user' });
    const shouldValidate = sinon.stub().returns(true);

    const result = createOidcMiddleware(userManagerMock, shouldValidate, null, callbackRoute)(storeMock)(nextStub)(action);
    expect(setItemStub.called).toEqual(false);
    expect(getUserStub.called).toEqual(false);
    expect(thenStub.called).toEqual(false);
    expect(catchStub.called).toEqual(false);
    expect(nextStub.calledWith(action)).toEqual(true);
    expect(result).toEqual(action);
  });

  it('should call localStorage and getUser() when the storedUser is expired', () => {
    setStoredUser({ expired: true });
    const shouldValidate = sinon.stub().returns(true);

    const result = createOidcMiddleware(userManagerMock, shouldValidate, null, callbackRoute)(storeMock)(nextStub)(action);
    expect(setItemStub.called).toEqual(true);
    expect(getUserStub.called).toEqual(true);
    expect(thenStub.called).toEqual(true);
    expect(catchStub.called).toEqual(true);
    expect(nextStub.calledWith(loadingUser())).toEqual(true);
    expect(nextStub.calledWith(action)).toEqual(false);
  });

  it('getUserSuccessCallback - should handle an expired user correctly', () => {
    const user = null;
    const result = getUserSuccessCallback(nextStub, userManagerMock, user, false, action);

    expect(nextStub.calledWith(userExpired())).toEqual(true);
    expect(nextStub.calledWith(action)).toEqual(true);
    expect(result).toEqual(action);
  });

  it('getUserSuccessCallback - should trigger the redirect when triggerAuthFlow is true', () => {
    const user = null;
    const result = getUserSuccessCallback(nextStub, userManagerMock, user, true, action);
    const stateData = {
      data: {
        redirectUrl: pathname
      }
    };

    expect(signinRedirectStub.calledWith(stateData)).toEqual(true);
    expect(nextStub.calledWith(userExpired())).toEqual(true);
    expect(nextStub.calledWith(action)).toEqual(false);
    expect(result).toEqual(undefined);
  });

  it('getUserSuccessCallback - should not trigger the redirect when triggerAuthFlow is false', () => {
    const user = null;
    const result = getUserSuccessCallback(nextStub, userManagerMock, user, false, action);

    expect(signinRedirectStub.called).toEqual(false);
    expect(nextStub.calledWith(userExpired())).toEqual(true);
    expect(nextStub.calledWith(action)).toEqual(true);
    expect(result).toEqual(action);
  });

  it('getUserSuccessCallback - should handle a valid user correctly', () => {
    const user = { some: 'user' };
    const result = getUserSuccessCallback(nextStub, userManagerMock, user, false, action);

    expect(signinRedirectStub.called).toEqual(false);
    expect(removeItemStub.calledWith(STORAGE_KEY)).toEqual(true);
    expect(nextStub.calledWith(userFound(user))).toEqual(true);
    expect(nextStub.calledWith(action)).toEqual(true);
    expect(storedUser).toEqual(user);
    expect(result).toEqual(action);
  });

  it('getUserErrorCallback - should handle callback errors correctly', () => {
    const error = { message: 'error' };

    expect(() => getUserErrorCallback(error)).toThrow(/error/);
    expect(removeItemStub.calledWith(STORAGE_KEY)).toEqual(true);
  });

  it('should clear localStorage when after a failed login attempt but keep the valid user entry', () => {
    localStorageMock = {
      STORAGE_KEY,
      'oidc.something': 'something',
      getItem: getItemStub,
      removeItem: removeItemStub,
      setItem: setItemStub,
      'oidc.user': 'some user data'
    };
    localStorage = localStorageMock;

    windowMock = {
      location: {
        pathname: '/someRoute'
      }
    };
    window = windowMock;
    getItemStub.returns(true);

    createOidcMiddleware(userManagerMock, null, null, callbackRoute)(storeMock)(nextStub)(action);

    expect(removeItemStub.calledWith(STORAGE_KEY)).toEqual(true);
    expect(removeItemStub.calledWith('oidc.something')).toEqual(true);
    expect(removeItemStub.neverCalledWith('oidc.user')).toEqual(true);
  });

  it('should not clear localStorage when the login attempt has been successfully redirected', () => {
    localStorageMock = {
      STORAGE_KEY,
      'oidc.something': 'something'
    };
    getItemStub.returns(true);

    createOidcMiddleware(userManagerMock, null, null, callbackRoute)(storeMock)(nextStub)(action);

    expect(removeItemStub.neverCalledWith(STORAGE_KEY)).toEqual(true);
    expect(removeItemStub.neverCalledWith('oidc.something')).toEqual(true);
  });
});
