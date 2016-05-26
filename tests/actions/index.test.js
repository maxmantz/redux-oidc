import expect from 'expect';
import sinon from 'sinon';
import { USER_EXPIRED, REDIRECT_SUCCESS, USER_FOUND, SILENT_RENEW_ERROR, USER_EXPIRING, SESSION_TERMINATED } from '../../src/constants';
import { userExpired, userFound, silentRenewError, sessionTerminated, userExpiring, redirectSuccess } from '../../src/actions';

describe('action - userExpired', () => {
  it('should return the correct action object', () => {
    const action = userExpired();
    expect(action.type).toEqual(USER_EXPIRED);
  });
});

describe('action - redirectSuccess', () => {
  it('should return the correct action object', () => {
    const user = { some: 'user' };
    const action = redirectSuccess(user);

    expect(action.type).toEqual(REDIRECT_SUCCESS);
    expect(action.payload).toEqual(user);
  });
});

describe('action - userFound', () => {
  it('should return the correct action object', () => {
    const user = { some: 'user' };
    const action = userFound(user);

    expect(action.type).toEqual(USER_FOUND);
    expect(action.payload).toEqual(user);
  });
});

describe('action - silentRenewError', () => {
  it('should return the correct action object', () => {
    const error = { some: 'error' };
    const action = silentRenewError(error);

    expect(action.type).toEqual(SILENT_RENEW_ERROR);
    expect(action.payload).toEqual(error);
  });
});

describe('action - sessionTerminated', () => {
  it('should return the correct action object', () => {
    const action = sessionTerminated();
    expect(action.type).toEqual(SESSION_TERMINATED);
  });
});

describe('action - userExpiring', () => {
  it('should return the correct action object', () => {
    const action = userExpiring();
    expect(action.type).toEqual(USER_EXPIRING);
  });
});
