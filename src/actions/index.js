import { USER_EXPIRED, REDIRECT_SUCCESS, USER_FOUND } from '../constants'

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

export function userFound(user) {
  return {
    type: USER_FOUND,
    payload: user
  };
}
