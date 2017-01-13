import './setup';
import expect from 'expect';
import sinon from 'sinon';
import OidcProvider from '../src/OidcProvider';
import { userExpired, userFound, silentRenewError, sessionTerminated, userExpiring, redirectSuccess, userSignedOut } from '../src/actions';

describe('<OidcProvider />', () => {
  let userManagerMock;
  let eventsMock;
  let storeMock;
  let addUserLoadedStub;
  let addSilentRenewErrorStub;
  let addAccessTokenExpiredStub;
  let addUserUnloadedStub;
  let addAccessTokenExpiringStub;
  let addUserSignedOutStub;
  let removeUserLoadedStub;
  let removeSilentRenewErrorStub;
  let removeAccessTokenExpiredStub;
  let removeUserUnloadedStub;
  let removeAccessTokenExpiringStub;
  let removeUserSignedOutStub;
  let dispatchStub;
  let props;
  let provider;

  beforeEach(() => {
    addUserLoadedStub = sinon.stub();
    addSilentRenewErrorStub = sinon.stub();
    addAccessTokenExpiredStub = sinon.stub();
    addUserUnloadedStub = sinon.stub();
    addAccessTokenExpiringStub = sinon.stub();
    addUserSignedOutStub = sinon.stub();
    removeUserLoadedStub = sinon.stub();
    removeSilentRenewErrorStub = sinon.stub();
    removeAccessTokenExpiredStub = sinon.stub();
    removeUserUnloadedStub = sinon.stub();
    removeAccessTokenExpiringStub = sinon.stub();
    removeUserSignedOutStub = sinon.stub();
    dispatchStub = sinon.stub();

    eventsMock = {
      addUserLoaded: addUserLoadedStub,
      addSilentRenewError: addSilentRenewErrorStub,
      addAccessTokenExpired: addAccessTokenExpiredStub,
      addUserUnloaded: addUserUnloadedStub,
      addAccessTokenExpiring: addAccessTokenExpiringStub,
      addUserSignedOut: addUserSignedOutStub,
      removeUserLoaded: removeUserLoadedStub,
      removeSilentRenewError: removeSilentRenewErrorStub,
      removeAccessTokenExpired: removeAccessTokenExpiredStub,
      removeUserUnloaded: removeUserUnloadedStub,
      removeAccessTokenExpiring: removeAccessTokenExpiringStub,
      removeUserSignedOut: removeUserSignedOutStub
    };

    userManagerMock = {
      events: eventsMock
    };

    storeMock = {
      dispatch: dispatchStub
    };

    props = {
      userManager: userManagerMock,
      store: storeMock
    };

    provider = new OidcProvider(props);
  });

  it('should be instantiated correctly', () => {
    expect(provider.userManager).toEqual(userManagerMock);
  });

  it('should register the events on componentWillMount()', () => {
    provider.componentWillMount();

    expect(addUserLoadedStub.calledWith(provider.onUserLoaded)).toEqual(true);
    expect(addSilentRenewErrorStub.calledWith(provider.onSilentRenewError)).toEqual(true);
    expect(addAccessTokenExpiredStub.calledWith(provider.onAccessTokenExpired)).toEqual(true);
    expect(addUserUnloadedStub.calledWith(provider.onUserUnloaded)).toEqual(true);
    expect(addAccessTokenExpiringStub.calledWith(provider.onAccessTokenExpiring)).toEqual(true);
    expect(addUserSignedOutStub.calledWith(provider.onUserSignedOut)).toEqual(true);
  });

  it('should remove event registrations on componentWillUnmount()', () => {
    provider.componentWillUnmount();

    expect(removeUserLoadedStub.calledWith(provider.onUserLoaded)).toEqual(true);
    expect(removeSilentRenewErrorStub.calledWith(provider.onSilentRenewError)).toEqual(true);
    expect(removeAccessTokenExpiredStub.calledWith(provider.onAccessTokenExpired)).toEqual(true);
    expect(removeUserUnloadedStub.calledWith(provider.onUserUnloaded)).toEqual(true);
    expect(removeAccessTokenExpiringStub.calledWith(provider.onAccessTokenExpiring)).toEqual(true);
    expect(removeUserSignedOutStub.calledWith(provider.onUserSignedOut)).toEqual(true);
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

  it('should handle the accessTokenExpiring event correctly', () => {
    provider.onAccessTokenExpiring();

    expect(dispatchStub.calledWith(userExpiring())).toEqual(true);
  });

  it('should handle the userSignedOut event correctly', () => {
    provider.onUserSignedOut();

    expect(dispatchStub.calledWith(userSignedOut())).toEqual(true);
  });
});
