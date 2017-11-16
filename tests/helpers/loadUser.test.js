import '../setup';
import sinon from 'sinon';
import expect from 'expect';
import loadUserHandler, {
  getUserCallback,
  errorCallback,
  setReduxStore,
  getReduxStore
} from '../../src/helpers/loadUser';
import { userExpired, userFound, loadUserError, loadingUser, userNotFound } from '../../src/actions';

describe('helper - loadUser()', () => {
  let userManagerMock;
  let storeMock;
  let getUserStub;
  let dispatchStub;
  let thenStub;
  let catchStub;

  beforeEach(() => {
    dispatchStub = sinon.stub();
    getUserStub = sinon.stub();
    thenStub = sinon.stub();
    catchStub = sinon.stub();

    userManagerMock = {
      getUser: getUserStub
    };

    storeMock = {
      dispatch: dispatchStub
    };

    getUserStub.returns({
      then: thenStub
    });

    thenStub.returns({
      catch: catchStub
    });

    setReduxStore(storeMock);
  });

  it('should dispatch a valid user to the store', () => {
    const validUser = { some: 'user' };

    getUserCallback(validUser);

    expect(dispatchStub.calledWith(userFound(validUser))).toEqual(true);
  });

  it('should dispatch USER_NOT_FOUND when no user is present', () => {
    getUserCallback(null);

    expect(dispatchStub.calledWith(userNotFound())).toEqual(true);
  });

  it('should dispatch USER_EXPIRED when no valid user is present', () => {
    const invalidUser = { expired: true };

    getUserCallback(invalidUser);

    expect(dispatchStub.calledWith(userExpired())).toEqual(true);
  });

  it('should dispatch LOADING_USER', () => {

    loadUserHandler(storeMock, userManagerMock);

    expect(dispatchStub.calledWith(loadingUser())).toEqual(true);
  });

  it('should set the redux store', () => {
    loadUserHandler(storeMock, userManagerMock);

    expect(getReduxStore() === storeMock).toEqual(true);
  });

  it('errorCallback should dispatch LOAD_USER_ERROR', () => {
    setReduxStore(storeMock);

    errorCallback({ message: 'Some message!' });

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
