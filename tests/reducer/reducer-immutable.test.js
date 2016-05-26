import '../setup';
import expect from 'expect';
import sinon from 'sinon';
import { fromJS } from 'immutable';
import { userExpired, userFound, silentRenewError, sessionTerminated, userExpiring, redirectSuccess } from '../../src/actions';
import reducer from '../../src/reducer/reducer-immutable';

describe('immutable reducer', () => {
  it('should set the correct initial state', () => {
    const initialState = fromJS({
      user: null
    });

    expect(reducer(undefined, { type: 'SOME_ACTION' })).toEqual(initialState);
  });

  it('should handle USER_EXPIRED correctly', () => {
    const expectedResult = fromJS({
      user: null
    });

    expect(reducer(fromJS({}), userExpired())).toEqual(expectedResult);
  });

  it('should handle SILENT_RENEW_ERROR correctly', () => {
    const expectedResult = fromJS({
      user: null
    });

    expect(reducer(fromJS({}), silentRenewError())).toEqual(expectedResult);
  });

  it('should handle REDIRECT_SUCCESS correctly', () => {
    const user = { some: 'user' };
    const expectedResult = fromJS({
      user
    });

    expect(reducer(fromJS({}), redirectSuccess(user))).toEqual(expectedResult);
  });

  it('should handle USER_FOUND correctly', () => {
    const user = { some: 'user' };
    const expectedResult = fromJS({
      user
    });

    expect(reducer(fromJS({}), userFound(user))).toEqual(expectedResult);
  });

  it('should handle SESSION_TERMINATED correctly', () => {
    const expectedResult = fromJS({
      user: null
    });

    expect(reducer(fromJS({}), sessionTerminated())).toEqual(expectedResult);
  });

  it('should handle the default correctly', () => {
    const expectedResult = fromJS({
      some: 'data'
    });

    expect(reducer(expectedResult, { type: 'UNKNOWN' })).toEqual(expectedResult);
  });
});
