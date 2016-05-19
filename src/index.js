import createTokenMiddleware from './tokenMiddleware';
import Callback from './CallbackComponent';
import helpers from './helpers';
import reducerImmutable from './reducer/reducer-immutable';
import standardReducer from './reducer/reducer';
import { USER_EXPIRED, REDIRECT_SUCCESS, STORAGE_KEY } from './constants';

export const createUserManager = helpers.createUserManager;
export const CallbackComponent = Callback;
export const immutableReducer = reducerImmutable;
export const reducer = standardReducer;
export const constants = {
  USER_EXPIRED,
  REDIRECT_SUCCESS,
  STORAGE_KEY
};
export const OidcProvider = require('./OidcProvider').default;

export default createTokenMiddleware;
