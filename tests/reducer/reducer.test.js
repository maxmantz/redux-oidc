import expect from 'expect';
import sinon from 'sinon';
import { userExpired, userFound, silentRenewError, sessionTerminated, userExpiring, redirectSuccess } from '../../src/actions';
import reducer from '../../src/reducer/reducer';

describe('reducer', () => {
  it('should set the correct initial state', () => {
    const initialState = {
      user: null
    };

    expect(reducer(undefined, { type: 'SOME_ACTION' })).toEqual(initialState);
  });

  it('should handle USER_EXPIRED correctly', () => {
    const expectedResult = {
      user: null
    };

    expect(reducer({}, userExpired())).toEqual(expectedResult);
  });

  it('should handle SILENT_RENEW_ERROR correctly', () => {
    const expectedResult = {
      user: null
    };

    expect(reducer({}, silentRenewError())).toEqual(expectedResult);
  });

  it('should handle REDIRECT_SUCCESS correctly', () => {
    const user = { some: 'user' };
    const expectedResult = {
      user
    };

    expect(reducer({}, redirectSuccess(user))).toEqual(expectedResult);
  });

  it('should handle USER_FOUND correctly', () => {
    const user = { some: 'user' };
    const expectedResult = {
      user
    };

    expect(reducer({}, userFound(user))).toEqual(expectedResult);
  });

  it('should handle SESSION_TERMINATED correctly', () => {
    const expectedResult = {
      user: null
    };

    expect(reducer({}, sessionTerminated())).toEqual(expectedResult);
  });

  it('should handle the default correctly', () => {
    const expectedResult = {
      some: 'data'
    };

    expect(reducer(expectedResult, { type: 'UNKNOWN' })).toEqual(expectedResult);
  });
});
