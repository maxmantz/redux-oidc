import createOidcMiddleware from './oidcMiddleware';

// redux-oidc components
export const createUserManager = require('./helpers/createUserManager').default;
export const processSilentRenew = require('./helpers/processSilentRenew').default;
export const loadUser = require('./helpers/loadUser').default;
export const CallbackComponent = require('./CallbackComponent').default;
export const createImmutableReducer = require('./reducer/reducer-immutable').default;
export const reducer = require('./reducer/reducer').default;
export const OidcProvider = require('./OidcProvider').default;
export const SignoutCallbackComponent = require('./SignoutCallbackComponent').default;

// constants
export const USER_EXPIRED = require('./constants').USER_EXPIRED;
export const USER_FOUND = require('./constants').USER_FOUND;
export const SILENT_RENEW_ERROR = require('./constants').SILENT_RENEW_ERROR;
export const SESSION_TERMINATED = require('./constants').SESSION_TERMINATED;
export const USER_EXPIRING = require('./constants').USER_EXPIRING;
export const LOADING_USER = require('./constants').LOADING_USER;
export const USER_SIGNED_OUT = require('./constants').USER_SIGNED_OUT;
export const LOAD_USER_ERROR = require('./constants').LOAD_USER_ERROR;

// actions
export const userExpired = require('./actions').userExpired;
export const userFound = require('./actions').userFound;
export const silentRenewError = require('./actions').silentRenewError;
export const sessionTerminated = require('./actions').sessionTerminated;
export const userExpiring = require('./actions').userExpiring;
export const loadingUser = require('./actions').loadingUser;
export const userSignedOut = require('./actions').userSignedOut;
export const loadUserError = require('./actions').loadUserError;

export default createOidcMiddleware;
