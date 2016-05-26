import createTokenMiddleware from './tokenMiddleware';
import Callback from './CallbackComponent';
import helpers from './helpers';
import reducerImmutable from './reducer/reducer-immutable';
import standardReducer from './reducer/reducer';
import { USER_EXPIRED, REDIRECT_SUCCESS, STORAGE_KEY } from './constants';

export const createUserManager = require('./helpers/createUserManager').default;
export const CallbackComponent = require('./CallbackComponent').default;
export const immutableReducer = require('./reducer/reducer-immutable').default;
export const reducer = require('./reducer/reducer').default;
export const constants = {
  USER_EXPIRED,
  REDIRECT_SUCCESS,
  STORAGE_KEY
};
export const OidcProvider = require('./OidcProvider').default;

export default createTokenMiddleware;
