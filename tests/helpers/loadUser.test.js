import '../setup';
import sinon from 'sinon';
import expect from 'expect';
import loadUserHandler, { getUserCallback, errorCallback, setReduxStore, getReduxStore } from '../../src/helpers/loadUser';
import { userExpired, userFound, loadUserError } from '../../src/actions';

describe('helper - loadUser()', () => {
  let userManagerMock;
  let storeMock;
  let getUserStub;
  let dispatchStub;

  beforeEach(() => {
    dispatchStub = sinon.stub();
    getUserStub = sinon.stub().returns(new Promise(() => {}));

    userManagerMock = {
      getUser: getUserStub
    };

    storeMock = {
      dispatch: dispatchStub
    };

    setReduxStore(storeMock);
  });

  it('should dispatch a valid user to the store', () => {
    const validUser = { some: 'user' };

    getUserCallback(validUser);

    expect(dispatchStub.calledWith(userFound(validUser))).toEqual(true);
  });

  it('should dispatch USER_EXPIRED when no valid user is present', () => {
    const invalidUser = { expired: true };

    getUserCallback(invalidUser);

    expect(dispatchStub.calledWith(userExpired())).toEqual(true);
  });

  it('should set the redux store', () => {
    loadUserHandler(storeMock, userManagerMock);

    expect(getReduxStore() === storeMock).toEqual(true);
  });

  it('should return a promise', () => {
    const promise = loadUserHandler(storeMock, userManagerMock);

    expect(promise).toBeA(Promise);
  });

  it('errorCallback should dispatch LOAD_USER_ERROR', () => {
    setReduxStore(storeMock);

    errorCallback({ message: 'Some message!'});

    expect(dispatchStub.calledWith(loadUserError())).toEqual(true);
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
});
