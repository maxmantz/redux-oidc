import { USER_EXPIRED, REDIRECT_SUCCESS } from '../constants'

export function userExpired() {
  return {
    type: USER_EXPIRED
  };
}

export function redirectSuccess(user) {
  return {
    type: REDIRECT_SUCCESS,
    payload: user
  };
}
