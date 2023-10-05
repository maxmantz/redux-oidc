// import './setup';
import { describe, it, expect, vi, beforeEach } from "vitest";
// import { render } from '@testing-library/react';
import OidcProvider from "../src/OidcProvider";
import {
  userExpired,
  userFound,
  silentRenewError,
  sessionTerminated,
  userExpiring,
  userSignedOut,
} from "../src/actions";

describe("<OidcProvider />", () => {
  let userManagerMock;
  let eventsMock;
  let storeMock;
  let dispatchMock;
  let props;
  let provider;

  beforeEach(() => {
    dispatchMock = vi.fn();
    eventsMock = {
      addUserLoaded: vi.fn(),
      addSilentRenewError: vi.fn(),
      addAccessTokenExpired: vi.fn(),
      addUserUnloaded: vi.fn(),
      addAccessTokenExpiring: vi.fn(),
      addUserSignedOut: vi.fn(),
      removeUserLoaded: vi.fn(),
      removeSilentRenewError: vi.fn(),
      removeAccessTokenExpired: vi.fn(),
      removeUserUnloaded: vi.fn(),
      removeAccessTokenExpiring: vi.fn(),
      removeUserSignedOut: vi.fn(),
    };
    userManagerMock = { events: eventsMock };
    storeMock = { dispatch: dispatchMock };
    props = { userManager: userManagerMock, store: storeMock };
    provider = new OidcProvider(props);
  });

  it("should be instantiated correctly", () => {
    expect(provider.userManager).toEqual(userManagerMock);
  });

  it("should register the events on constructor", () => {
    expect(eventsMock.addUserLoaded)
      .toHaveBeenCalledWith(provider.onUserLoaded)
      .toBeTruthy();
    expect(eventsMock.addSilentRenewError)
      .toHaveBeenCalledWith(provider.onSilentRenewError)
      .toBeTruthy();
    expect(eventsMock.addAccessTokenExpired)
      .toHaveBeenCalledWith(provider.onAccessTokenExpired)
      .toBeTruthy();
    expect(eventsMock.addUserUnloaded)
      .toHaveBeenCalledWith(provider.onUserUnloaded)
      .toBeTruthy();
    expect(eventsMock.addAccessTokenExpiring)
      .toHaveBeenCalledWith(provider.onAccessTokenExpiring)
      .toBeTruthy();
    expect(eventsMock.addUserSignedOut)
      .toHaveBeenCalledWith(provider.onUserSignedOut)
      .toBeTruthy();
  });

  it("should remove event registrations on componentWillUnmount()", () => {
    provider.componentWillUnmount();

    expect(eventsMock.removeUserLoaded)
      .toHaveBeenCalledWith(provider.onUserLoaded)
      .toBeTruthy();
    expect(eventsMock.removeSilentRenewError)
      .toHaveBeenCalledWith(provider.onSilentRenewError)
      .toBeTruthy();
    expect(eventsMock.removeAccessTokenExpired)
      .toHaveBeenCalledWith(provider.onAccessTokenExpired)
      .toBeTruthy();
    expect(eventsMock.removeUserUnloaded)
      .toHaveBeenCalledWith(provider.onUserUnloaded)
      .toBeTruthy();
    expect(eventsMock.removeAccessTokenExpiring)
      .toHaveBeenCalledWith(provider.onAccessTokenExpiring)
      .toBeTruthy();
    expect(eventsMock.removeUserSignedOut)
      .toHaveBeenCalledWith(provider.onUserSignedOut)
      .toBeTruthy();
  });

  it("should handle the userLoaded event correctly", () => {
    const user = { some: "user" };
    provider.onUserLoaded(user);

    expect(storeMock.dispatch).toHaveBeenCalledWith(userFound(user));
  });

  it("should handle the silentRenewError event correctly", () => {
    const error = { some: "error" };
    provider.onSilentRenewError(error);

    expect(storeMock.dispatch)
      .toHaveBeenCalledWith(silentRenewError(error))
      .toBeTruthy();
  });

  it("should handle the accessTokenExpired event correctly", () => {
    provider.onAccessTokenExpired();

    expect(storeMock.dispatch).toHaveBeenCalledWith(userExpired());
  });

  it("should handle the userUnloaded event correctly", () => {
    provider.onUserUnloaded();

    expect(storeMock.dispatch).toHaveBeenCalledWith(sessionTerminated());
  });

  it("should handle the accessTokenExpiring event correctly", () => {
    provider.onAccessTokenExpiring();

    expect(storeMock.dispatch).toHaveBeenCalledWith(userExpiring());
  });

  it("should handle the userSignedOut event correctly", () => {
    provider.onUserSignedOut();

    expect(storeMock.dispatch).toHaveBeenCalledWith(userSignedOut());
  });
});
