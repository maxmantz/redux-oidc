import '../setup';
import expect from 'expect';
import immutable from 'immutable';
import { userExpired, userFound, silentRenewError, sessionTerminated, loadingUser, userSignedOut } from '../../src/actions';
import createImmutableReducer from '../../src/reducer/reducer-immutable';

const { fromJS } = immutable;

const initialState = fromJS({
    user: null,
    isLoadingUser: false
});

describe('createImmutableReducer(immutable)', () => {
  it('should set the correct initial state', () => {
    const reducer = createImmutableReducer(immutable);
    expect(reducer(undefined, { type: 'SOME_ACTION' })).toEqual(initialState);
  });

  it('should handle USER_EXPIRED correctly', () => {
    const state = fromJS({
      user: { some: 'user' },
      isLoadingUser: true
    });

    const expectedResult = fromJS({
      user: null,
      isLoadingUser: false
    });

    const reducer = createImmutableReducer(immutable);

    expect(reducer(state, userExpired())).toEqual(expectedResult);
  });

  it('should handle SILENT_RENEW_ERROR correctly', () => {
    const oldState = fromJS({
      user: { some: 'user' },
      isLoadingUser: true
    });

    const expectedResult = fromJS({
      user: null,
      isLoadingUser: false
    });

    const reducer = createImmutableReducer(immutable);

    expect(reducer(fromJS(oldState), silentRenewError())).toEqual(expectedResult);
  });

  it('should handle USER_FOUND correctly', () => {
    const user = { some: 'user' };
    const expectedResult = fromJS({
      user,
      isLoadingUser: false
    });

    const reducer = createImmutableReducer(immutable);
    expect(reducer(fromJS(initialState), userFound(user))).toEqual(expectedResult);
  });

  it('should handle SESSION_TERMINATED correctly', () => {
    const expectedResult = fromJS({
      user: null,
      isLoadingUser: false
    });

    const reducer = createImmutableReducer(immutable);
    expect(reducer(fromJS({}), sessionTerminated())).toEqual(expectedResult);
  });

  it('should handle LOADING_USER correctly', () => {
    const expectedResult = fromJS({
      user: null,
      isLoadingUser: true
    });

    const reducer = createImmutableReducer(immutable);
    expect(reducer(initialState, loadingUser())).toEqual(expectedResult);
  });

  it('should handle USER_SIGNED_OUT correctly', () => {
    const expectedResult = fromJS({
      user: null,
      isLoadingUser: false
    });

    const reducer = createImmutableReducer(immutable);
    expect(reducer(initialState, userSignedOut())).toEqual(expectedResult);
  });

  it('should handle the default correctly', () => {
    const expectedResult = fromJS({
      some: 'data'
    });

    const reducer = createImmutableReducer(immutable);
    expect(reducer(expectedResult, { type: 'UNKNOWN' })).toEqual(expectedResult);
  });

  it('should handle USER_FOUND correctly when payload has non-object prototype', () => {
      function NonObject() {
        this.type = 'not-an-object'
      }
      const user = { some: 'user' };
      const nonObjectUser = Object.setPrototypeOf({ some: 'user' }, new NonObject());
      const expectedResult = fromJS({
          user,
          isLoadingUser: false
      });

      const reducer = createImmutableReducer(immutable);
      expect(reducer(fromJS(initialState), userFound(nonObjectUser))).toEqual(expectedResult);
  });
});
