import OidcTokenManager from '../libs/oidc-token-manager';
import createTokenMiddleware from './tokenMiddleware';
import CallbackComponent from './CallbackComponent';
import helpers from './helpers';

export { CallbackComponent,
  createTokenManager: helpers.createTokenManager,
  logout: helpers.logout,
  logoutAtIdentityService: helpers.logoutAtIdentityService };

export default createTokenMiddleware;
