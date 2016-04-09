import OidcTokenManager from '../libs/oidc-token-manager';
import createTokenMiddleware from './tokenMiddleware';
import CallbackComponent from './CallbackComponent';
import {createTokenManager, logout, logoutAtIdentityService} from './helpers';

export { CallbackComponent, createTokenManager, logout, logoutAtIdentityService };

export default createTokenMiddleware;
