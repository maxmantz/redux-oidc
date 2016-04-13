import OidcTokenManager from '../libs/oidc-token-manager';
import createTokenMiddleware from './tokenMiddleware';
import Callback from './CallbackComponent';
import helpers from './helpers';

export const createTokenManager = helpers.createTokenManager;
export const logout = helpers.logout;
export const logoutAtIdentityService = helpers.logoutAtIdentityService;
export const triggerAuthFlow = helpers.triggerAuthFlow;
export const CallbackComponent = Callback;

export default createTokenMiddleware;
