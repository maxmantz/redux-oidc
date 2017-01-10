import '../setup';
import expect from 'expect';
import sinon from 'sinon';
import {
  userExpired,
  userFound,
  userNotFound,
  silentRenewError,
  sessionTerminated,
  userExpiring,
  redirectSuccess,
  loadingUser,
  userSignedOut
} from '../../src/actions';
import reducer from '../../src/reducer/reducer';

const initialState = {
      user: null,
      isLoadingUser: false
    };

describe('reducer', () => {
  it('should set the correct initial state', () => {
    expect(reducer(undefined, { type: 'SOME_ACTION' })).toEqual(initialState);
  });

  it('should handle USER_EXPIRED correctly', () => {
    const expectedResult = {
      user: null,
      isLoadingUser: false
    };

    expect(reducer(initialState, userExpired())).toEqual(expectedResult);
  });

  it('should handle SILENT_RENEW_ERROR correctly', () => {
    const expectedResult = {
      user: null,
      isLoadingUser: false
    };

    expect(reducer(initialState, silentRenewError())).toEqual(expectedResult);
  });

  it('should handle REDIRECT_SUCCESS correctly', () => {
    const user = { some: 'user' };
    const expectedResult = {
      user,
      isLoadingUser: false
    };

    expect(reducer({}, redirectSuccess(user))).toEqual(expectedResult);
  });

  it('should handle USER_FOUND correctly', () => {
    const user = { some: 'user' };
    const expectedResult = {
      user,
      isLoadingUser: false
    };

    expect(reducer({}, userFound(user))).toEqual(expectedResult);
  });

  it('should handle SESSION_TERMINATED correctly', () => {
    const expectedResult = {
      user: null,
      isLoadingUser: false
    };

    expect(reducer({}, sessionTerminated())).toEqual(expectedResult);
  });

  it('should handle LOADING_USER correctly', () => {
    const expectedResult = {
      user: null,
      isLoadingUser: true
    };

    expect(reducer(initialState, loadingUser())).toEqual(expectedResult);
  });

  it('should handle USER_SIGNED_OUT correctly', () => {
    const expectedResult = {
      user: null,
      isLoadingUser: false
    };

    expect(reducer(initialState, userSignedOut())).toEqual(expectedResult);
  });

  it('should handle the default correctly', () => {
    const expectedResult = {
      some: 'data'
    };

    expect(reducer(expectedResult, { type: 'UNKNOWN' })).toEqual(expectedResult);
  });
});
