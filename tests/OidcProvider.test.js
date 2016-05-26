import './setup';
import expect from 'expect';
import sinon from 'sinon';
import OidcProvider from '../src/OidcProvider';
import { userExpired, userFound, silentRenewError, sessionTerminated, userExpiring, redirectSuccess } from '../src/actions';

describe('<OidcProvider />', () => {
  let userManagerMock;
  let eventsMock;
  let storeMock;
  let addUserLoadedStub;
  let addSilentRenewErrorStub;
  let addAccessTokenExpiredStub;
  let addUserUnloadedStub;
  let addUserExpiringStub;
  let removeUserLoadedStub;
  let removeSilentRenewErrorStub;
  let removeAccessTokenExpiredStub;
  let removeUserUnloadedStub;
  let removeUserExpiringStub;
  let dispatchStub;
  let props;
  let provider;

  beforeEach(() => {
    addUserLoadedStub = sinon.stub();
    addSilentRenewErrorStub = sinon.stub();
    addAccessTokenExpiredStub = sinon.stub();
    addUserUnloadedStub = sinon.stub();
    addUserExpiringStub = sinon.stub();
    removeUserLoadedStub = sinon.stub();
    removeSilentRenewErrorStub = sinon.stub();
    removeAccessTokenExpiredStub = sinon.stub();
    removeUserUnloadedStub = sinon.stub();
    removeUserExpiringStub = sinon.stub();
    dispatchStub = sinon.stub();

    eventsMock = {
      addUserLoaded: addUserLoadedStub,
      addSilentRenewError: addSilentRenewErrorStub,
      addAccessTokenExpired: addAccessTokenExpiredStub,
      addUserUnloaded: addUserUnloadedStub,
      addUserExpiring: addUserExpiringStub,
      removeUserLoaded: removeUserLoadedStub,
      removeSilentRenewError: removeSilentRenewErrorStub,
      removeAccessTokenExpired: removeAccessTokenExpiredStub,
      removeUserUnloaded: removeUserUnloadedStub,
      removeUserExpiring: removeUserExpiringStub
    };

    userManagerMock = {
      events: eventsMock
    };

    storeMock = {
      dispatch: dispatchStub
    };

    props = {
      userManager: userManagerMock
    };

    provider = new OidcProvider(props);
    provider.context = Object.assign({}, { ...provider.context }, { store: storeMock });
  });

  it('should be instantiated correctly', () => {
    expect(provider.userManager).toEqual(userManagerMock);
  });

  it('should have the correct child context', () => {
    const childContext = { userManager: userManagerMock };

    expect(provider.getChildContext()).toEqual(childContext);
  });

  it('should register the events on componentWillMount()', () => {
    provider.componentWillMount();

    expect(addUserLoadedStub.calledWith(provider.onUserLoaded)).toEqual(true);
    expect(addSilentRenewErrorStub.calledWith(provider.onSilentRenewError)).toEqual(true);
    expect(addAccessTokenExpiredStub.calledWith(provider.onAccessTokenExpired)).toEqual(true);
    expect(addUserUnloadedStub.calledWith(provider.onUserUnloaded)).toEqual(true);
    expect(addUserExpiringStub.calledWith(provider.onUserExpiring)).toEqual(true);
  });

  it('should remove event registrations on componentWillUnmount()', () => {
    provider.componentWillUnmount();

    expect(removeUserLoadedStub.calledWith(provider.onUserLoaded)).toEqual(true);
    expect(removeSilentRenewErrorStub.calledWith(provider.onSilentRenewError)).toEqual(true);
    expect(removeAccessTokenExpiredStub.calledWith(provider.onAccessTokenExpired)).toEqual(true);
    expect(removeUserUnloadedStub.calledWith(provider.onUserUnloaded)).toEqual(true);
    expect(removeUserExpiringStub.calledWith(provider.onUserExpiring)).toEqual(true);
  });

  it('should handle the userLoaded event correctly', () => {
    const user = { some: 'user' };
    provider.onUserLoaded(user);

    expect(dispatchStub.calledWith(userFound(user))).toEqual(true);
  });

  it('should handle the silentRenewError event correctly', () => {
    const error = { some: 'error' };
    provider.onSilentRenewError(error);

    expect(dispatchStub.calledWith(silentRenewError(error))).toEqual(true);
  });

  it('should handle the accessTokenExpired event correctly', () => {
    provider.onAccessTokenExpired();

    expect(dispatchStub.calledWith(userExpired())).toEqual(true);
  });

  it('should handle the userUnloaded event correctly', () => {
    provider.onUserUnloaded();

    expect(dispatchStub.calledWith(sessionTerminated())).toEqual(true);
  });

  it('should handle the userExpiring event correctly', () => {
    provider.onUserExpiring();

    expect(dispatchStub.calledWith(userExpiring())).toEqual(true);
  });
});
